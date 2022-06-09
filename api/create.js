// import {useStrapi4} from "@nuxtjs/strapi/dist/runtime/composables/useStrapi4";

export default async function () {
    const { create } = useStrapi4()
    return create('store-finders', {
        country: 'Ukraine',
        "city": [
            {
                "name": "Alexandria",
                "store": [
                    {
                        "title": "Bridals by Natalie",
                        "publish": true
                    }
                ]
            },
            {
                "name": "Austin"
            }
        ]
    });
}
