import DashboardEditCar from "@/src/components/dashboard/vehiculos/editVehiculo/DasboardEditCar"

async function EditCarPage({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <DashboardEditCar id={id}/>
}

export default EditCarPage
