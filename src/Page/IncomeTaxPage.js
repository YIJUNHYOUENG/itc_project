import Header from "../Components/Header"
import InputComponent from "../Components/InputComponent";

function IncomeTaxPage() {
    return (
        <>
            <Header/>
            <div style={{width: "100%", height: "600px"}}>
                <div style={{height: "100%", marginLeft: "400px", marginRight: "400px", marginTop: "120px"}}>
                    <InputComponent info={{height_input: "400px", height_explain: "420px", height_result: "700px", visible: "incomeTax"}}/>
                </div>
            </div>
        </>
    )
}

export default IncomeTaxPage;