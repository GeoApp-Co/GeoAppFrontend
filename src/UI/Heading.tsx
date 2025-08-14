import Divider from "./Divider"

function Heading({children} : {children: React.ReactNode}) {

    return (
        <>
            <h1
                className="text-3xl font-black text-center my-5 text-azul"
            >{children}</h1>

            <Divider/>
        </>
    )
}

export default Heading
