export function formatterNumber(value) {
    let number_reg = /[^0-9.]/g;
    let comma_reg = /(.)(?=(\d{3})+$)/g;

    return value.replace(number_reg, "").replace(comma_reg, '$1,');
}

export function formatterRate(value) {
    let number_reg = /[^0-9.]/g;

    return value.replace(number_reg, "");
}

export function per1000(value) {
    let v = parseInt(value);

    if(v > 1000) {
        value = value.substring(0,3);
    }

    return value;
}

export function formatterDateYYYYMM(value) {
    let number_reg = /[^0-9.]/g;

    value = String(value.replace(number_reg, ""));

    if(value.length > 6) {
        value = value.substring(0,6);
    }

    switch(value.length) {
        case 5:
            value = value.substring(0, 4) + "-" + value.substring(4,5);
            break;
        case 6:
            value = value.substring(0, 4) + "-" + value.substring(4,6);
            break;
    }

    return value;
}

export function formatterDateYYYYMMDD(value) {
    let number_reg = /[^0-9.]/g;

    value = String(value.replace(number_reg, ""));

    if(value.length > 8) {
        value = value.substring(0,8);
    }

    switch(value.length) {
        case 5:
            value = value.substring(0, 4) + "-" + value.substring(4,5);
            break;
        case 6:
            value = value.substring(0, 4) + "-" + value.substring(4,6);
            break;
        case 7:
            value = value.substring(0, 4) + "-" + value.substring(4,6) + "-" + value.substring(6,7);
            break;
        case 8:
            value = value.substring(0, 4) + "-" + value.substring(4,6) + "-" + value.substring(6,8);
            break;
    }

    return value;
}

export function calculator202102(tax_amt, res_income_tax) {
    if(tax_amt > 10000000 && tax_amt <= 14000000) {
        let other1000 = tax_amt - 10000000;
        other1000 *= 0.98;
        other1000 *= 0.35;

        res_income_tax += other1000;
    } else if(tax_amt > 14000000 && tax_amt <= 28000000) {
        let other1400 = tax_amt - 14000000;
        other1400 *= 0.98;
        other1400 *= 0.38;

        res_income_tax += 1372000 + other1400;
    } else if(tax_amt > 28000000 && tax_amt <= 30000000) {
        let other2800 = tax_amt - 28000000;
        other2800 *= 0.98;
        other2800 *= 0.4;

        res_income_tax += 6585600 + other2800;
    } else if(tax_amt > 30000000 && tax_amt <= 45000000) {
        let other3000 = tax_amt - 30000000;
        other3000 *= 0.4;

        res_income_tax += 7369600 + other3000;
    } else if(tax_amt > 45000000 && tax_amt <= 87000000) {
        let other4500 = tax_amt - 45000000;
        other4500 *= 0.42;

        res_income_tax += 13369600 + other4500;
    } else if(tax_amt > 87000000) {
        let other8700 = tax_amt - 87000000;
        other8700 *= 0.45;

        res_income_tax += 31009600 + other8700;
    }

    return res_income_tax;
}

export function calculator202302(tax_amt, res_income_tax) {
    if(tax_amt > 10000000 && tax_amt <= 14000000) {
        let other1000 = tax_amt - 10000000;
        other1000 *= 0.98;
        other1000 *= 0.35;

        res_income_tax += other1000 + 25000;
    } else if(tax_amt > 14000000 && tax_amt <= 28000000) {
        let other1400 = tax_amt - 14000000;
        other1400 *= 0.98;
        other1400 *= 0.38;

        res_income_tax += 1397000 + other1400;
    } else if(tax_amt > 28000000 && tax_amt <= 30000000) {
        let other2800 = tax_amt - 28000000;
        other2800 *= 0.98;
        other2800 *= 0.4;

        res_income_tax += 6610600 + other2800;
    } else if(tax_amt > 30000000 && tax_amt <= 45000000) {
        let other3000 = tax_amt - 30000000;
        other3000 *= 0.4;

        res_income_tax += 7394600 + other3000;
    } else if(tax_amt > 45000000 && tax_amt <= 87000000) {
        let other4500 = tax_amt - 45000000;
        other4500 *= 0.42;

        res_income_tax += 13394600 + other4500;
    } else if(tax_amt > 87000000) {
        let other8700 = tax_amt - 87000000;
        other8700 *= 0.45;

        res_income_tax += 31034600 + other8700;
    }

    return res_income_tax;
}

export function calculatorFamilyChildCnt(res_income_tax, familyChildCntSelect) {
    if(familyChildCntSelect == 1) {
        res_income_tax -= 12500;
    } else if(familyChildCntSelect >= 2) {
        let cnt = familyChildCntSelect;
        res_income_tax -= 29160;
        cnt -= 2;
        if(cnt > 0) {
            res_income_tax -= (25000 * cnt);
        }
    }

    return res_income_tax;
}

// 원단위 절삭
export function delAmt0(amt) {
    return parseInt(parseInt(amt)/10) * 10;
}

export function whileFirstZeroDel(v) {
    let amt = "";

    for(let i=0;i<v.length;i++) {
        if(v[i] != "0") {
            break;
        } else if(v[i] == "0") {
            amt = v.substring(i+1);
            break;
        }
    }

    if(amt == "") {
        amt = v;
    }

    return amt;
}