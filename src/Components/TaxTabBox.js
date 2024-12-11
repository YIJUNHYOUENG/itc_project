import "../css/TaxTabBox.css"

function TaxTabBox({ info }) {
    return (
        <div className="box">
            <a style={{display: "inline-block", textDecoration: "none"}} className="full-size" href={info.url}>
                <div className="font-box">
                    {info.name}
                </div>
            </a>
        </div>
    );
}

export default TaxTabBox;