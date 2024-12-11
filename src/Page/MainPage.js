import Header from "../Components/Header"
import TaxTabBox from "../Components/TaxTabBox"

function MainPage() {
    return (
        <>
            <Header/>
            <div style={{width: "100%", height: "600px"}}>
                <div style={{height: "1200px"}}>
                    <div style={{width: "100%", textAlign: "center", marginTop:"35px"}}>
                        <TaxTabBox info={{name: "근로 소득세", url: "income_tax_calc"}}/>
                        <TaxTabBox info={{name: "4대보험 소득세", url: "major_insur_calc"}}/>
                    </div>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <TaxTabBox info={{name: "상여 소득세", url: "bonus_income_tax_calc"}}/>
                        <TaxTabBox info={{name: "퇴직 소득세", url: "retire_income_tax_calc"}}/>
                    </div>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <TaxTabBox info={{name: "사업 소득세", url: "business_income_tax_calc"}}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainPage;