import {Pinecone} from '@pinecone-database/pinecone'

// https://docs.bentoml.com/en/latest/use-cases/embeddings/clip-embeddings.html
export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return
    const config = useRuntimeConfig();
    const apiKey = config.PINECONE_KEY;
    let mode = config.MODE // locale or production



    try {
        let _body = await readBody(event)
        if (typeof _body === 'string') _body = JSON.parse(_body)

        if (_body.mode) mode = _body.mode


        const pc = new Pinecone({ apiKey });
        // console.log(await pc.describeIndex('millanova')); // Get index info
        // return await pc.describeIndex('millanova1')
        const index = pc.index("millanova1").namespace(_body.locale+'-'+mode);
        // return index

        // const results = await index.listPaginated();
        // return  results

        // Create/update (Payload from admin. To create vectors)
        if (_body.id) {
            await managingImagesFromAdminPayload(index, _body, mode)
            return
        }

        // Search
        if (_body.url || _body.text) {
            const vector = await getVector(_body);
            const searchResult = await searchProduct(index, vector);
            return searchResult.matches
        }



        // Update all products in one locale body: {locale, mode}
        if (_body.locale) {
            const allProductsEn = await getAllProducts(_body.locale, -1)

            for (let i in allProductsEn) {
                const product = allProductsEn[i]
                // console.log(im);
                try {
                    await managingImagesFromAdminPayload(index, product, mode)
                    console.log(i,'/', allProductsEn.length, 'Updated product id: '+product.id)
                } catch (e) {
                    console.error('Not: '+product.id)
                }
            }

            return 'done'
        }






    } catch (e) {
        console.log(e);
    }


})

async function getVector(body) {
    // https://github.com/bentoml/BentoML
    // clip-api-service
    const query = []
    if (body.url) {
        if (body.url.startsWith('data:image')) {
            const b = body.url.split(';base64,')[1]
            query.push({ "img_blob": b })
        } else {
            query.push({ "img_uri": body.url })
        }
    }
    if (body.text) {
        query.push({ "text": body.text })
    }
    try {
        const res = await fetch('http://138.197.96.166/encode', {
            method: "POST",
            body: JSON.stringify([
                ...query
            ]),
        });
        const vectors = await res.json()
        // console.log({vectors});
        return vectors[0]
    } catch (e) {
        console.error(e);
        throw e
    }

}
async function searchProduct(index, vector) {
    try {
        const queryResponse = await index.query({
            topK: 10,
            vector: vector,
            includeValues: false,
            includeMetadata: true
        });

        return queryResponse
    } catch (e) {
        throw e
    }

}


async function managingImagesFromAdminPayload(index, body, mode) {

    // Create
    const _image_for_local_test = 'https://millanova.nyc3.cdn.digitaloceanspaces.com/medium_N9_A5145_b0932f95c8.jpg'
    const productId = body.id
    const images = body.images
    const slug = body.slug
    const type = body.type
    const title = body.title
    const locale = body.locale

    const isPublished = body.publishedAt != null;
    const isSlug = body.slug != null;
    const isType = body.type != null;
    const containsImages = images.length > 0;

    const promises = []

    if (isPublished && containsImages && isSlug && isType) {
        images.forEach(image => {
            const imageUrl = image.formats?.medium?.url
            if (imageUrl) {
                promises.push(
                    new Promise(async (resolve, reject) => {
                        const vector = await getVector({url: mode === 'local' ? _image_for_local_test : imageUrl })
                        resolve({...image, vector})
                    })
                )
            }
        })
    }


    try {
        // Find ids to delete
        let idsListToRemove = await index.listPaginated({ prefix: productId.toString() });
        idsListToRemove = idsListToRemove.vectors.map(v => v.id)

        // Delete all old
        if (idsListToRemove.length > 0) await index.deleteMany([...idsListToRemove]);
        console.log('Deleted: ', idsListToRemove);


        // Vectors
        const imagesWithVectors = await Promise.all(promises)

        // Upsert
        const dataToUpsert = imagesWithVectors.map(res => {
            return {
                id: productId + '-' + res.id,
                values: res.vector,
                metadata: {
                    productId,
                    imageId: res.id,
                    locale,
                    title,
                    slug,
                    type,
                    cover_3x4: JSON.stringify({
                        id: res.id,
                        formats: res.formats
                    })
                }
            };
        })

        if (dataToUpsert.length > 0) await index.upsert(dataToUpsert)
        console.log(`Upsert ${dataToUpsert.length} items`);


    } catch (e) {
        console.error(e);
        throw e
    }







    // console.log('-------',body);
    // checkUpdatedFields(_body.product, _body.productPrevious)
}


async function getAllProducts(locale = 'en', limit = -1) {
    try {
        const res = await fetch('https://admin.millanova.com/api/products?locale='+locale+'&[pagination][limit]='+limit+'&populate[cover_3x4][fields][0]=formats&populate[gallery][fields][0]=formats&populate[type][fields]')
        const data = await res.json()
        // return data
        return data.data.map(d => {
            const images = []
            if (d.attributes?.cover_3x4 && d.attributes?.cover_3x4?.data?.attributes?.formats?.medium) {
                images.push({id: d.attributes.cover_3x4.data.id, formats: d.attributes?.cover_3x4?.data?.attributes?.formats})
            }
            if (d.attributes?.gallery && d.attributes?.gallery?.data?.length > 0) {
                d.attributes?.gallery?.data.forEach(im => {
                    if (im.attributes?.formats?.medium) {
                        images.push({id: im.id, formats: im.attributes?.formats})
                    }
                })
            }
            return {
                id: d.id,
                locale: d.attributes?.locale,
                title: d.attributes?.title,
                slug: d.attributes?.slug,
                type: d.attributes?.type?.data?.attributes?.slug,
                publishedAt: d.attributes?.publishedAt,
                images,

            }
        })
    } catch (e) {
        console.error(e);
    }
}
