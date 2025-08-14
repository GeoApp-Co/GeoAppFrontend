import ItemEdit from "@/src/components/dashboard/item/editItem/ItemEdit"

async function ItemEditPage({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <ItemEdit id={id} />
}

export default ItemEditPage
