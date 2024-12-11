import Header from "../Components/Header"
import InputComponent from "../Components/InputComponent";

function RetireIncomeTax() {
    return (
        <>
            <Header/>
            <div style={{width: "100%", height: "600px"}}>
                <div style={{height: "100%", marginLeft: "400px", marginRight: "400px", marginTop: "120px"}}>
                    <InputComponent info={{height_input: "630px", height_explain: "350px", height_result: "600px", visible: "retireIncomeTax"}}/>
                </div>
            </div>
        </>
    )
}

export default RetireIncomeTax;