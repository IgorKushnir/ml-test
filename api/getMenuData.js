import {getMenu} from '~/api/queries'
import {useClientHandle} from "@urql/vue";

export default async function () {

    const urql = useClientHandle();
    const {data, fetching, error} = await urql.useQuery({query: getMenu('en')});
    // console.log('error', error.value);
    const menu = data.value.menu.data.attributes;
    const lines = data.value.lines.data;

    // Check if line is empty (collection inside)
    lines.forEach((line, index) => {
        if (line.attributes.collections.data.length <= 0) {
            lines.splice(index, 1)
        }
    });


    return [menu, lines]
}
