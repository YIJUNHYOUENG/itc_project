const express = require('express');
const db = require('../database/db');
const router = express.Router();

// 로그인 검증
router.post('/login', (req, res) => {
    let query = `select user_id from user_info where user_id = '${req.body.id}' and user_pwd = '${req.body.pwd}';`;

    db.query(query, function (err, results, fields) {
        if (err) throw err;

        res.send(results);
    });
});

// 회원가입
router.post('/signup', (req, res) => {
    // 중복 아이디 검증
    let query = `select user_id from user_info where user_id = '${req.body.id}';`;

    db.query(query, function (err, results, fields) {
        if (err) throw err;
        
        if(results.length) {
            res.send({
                success: false,
                message: "이미 존재하는 아이디입니다."
            });
        } else {
            // 유저 추가
            query = `insert into user_info(user_id, user_pwd) values ('${req.body.id}', '${req.body.pwd}')`;

            db.query(query, function (inner_err, inner_results, inner_fields) {
                if (inner_err) throw inner_err;

                res.send({
                    success: true,
                    message: "회원가입 성공."
                });
            });
        }
    });
});

router.post("/income_tax_select", (req, res) => {
    let query = `select income_tax from income_tax_list where start_amt <= ${req.body.income_amt} and end_amt > ${req.body.income_amt} and family_count = ${req.body.family_count} and income_ym = '${req.body.income_ym}';`;
    console.log(query)

    db.query(query, function (err, results, fields) {
        if (err) throw err;
        
        res.send(results);
    });
});

// 비밀번호 검증
router.post("/chk_pwd", (req, res) => {
    let query = `select count(*) cnt from user_info where user_id = ${req.body.id} and user_pwd = '${req.body.pwd}';`;

    db.query(query, function (err, results, fields) {
        if (err) throw err;
        
        res.send(results);
    });
});

// 비밀번호 변경
router.post("/change_pwd", (req, res) => {
    let query = `update user_info set user_pwd = '${req.body.pwd}' where user_id = ${req.body.id}`;

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

// 근로소득세 저장
router.post("/save_income_tax", (req, res) => {
    let query = `insert income_tax values(${req.body.id}, '${req.body.income_year}', '${req.body.income_month}',`
                + `${req.body.month_amt}, ${req.body.nontax_amt}, ${req.body.family_count}, ${req.body.child_count}, ${req.body.withhol_rate})`
                + ` ON DUPLICATE KEY UPDATE `
                + ` income_year = '${req.body.income_year}', income_month = '${req.body.income_month}',`
                + ` month_amt = ${req.body.month_amt}, nontax_amt = ${req.body.nontax_amt},`
                + ` family_count = ${req.body.family_count}, child_count = ${req.body.child_count}, withhol_rate = ${req.body.withhol_rate}`;
   
    console.log(query)

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

// 근로소득세 조회
router.post("/user_income_tax", (req, res) => {
    let query = `select * from income_tax where user_id = ${req.body.id}`;

    db.query(query, function (inner_err, results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send(results);
    });
});

router.post("/save_bonus_income_tax", (req, res) => {
    let query = `insert bonus_tax_mst values(${req.body.id}, '${req.body.income_year}', '${req.body.income_month}',`
                + `${req.body.month_amt}, ${req.body.family_count}, ${req.body.child_count}, ${req.body.withhol_rate}, '${req.body.before_amt_month}')`
                + ` ON DUPLICATE KEY UPDATE `
                + ` income_year = '${req.body.income_year}', income_month = '${req.body.income_month}',`
                + ` month_amt = ${req.body.month_amt}, family_count = ${req.body.family_count}, child_count = ${req.body.child_count},`
                + ` withhol_rate = ${req.body.withhol_rate}, before_amt_month='${req.body.before_amt_month}'`;

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

// 상여소득세 저장
router.post("/save_bonus_income_tax_detail", (req, res) => {
    let chk = false;
    let query = `delete from bonus_tax_detail where user_id = ${req.body[0].id}`;
   
    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;
    });

    for(let i=0;i<req.body.length;i++) {
        let value = req.body[i];

        query = `insert into bonus_tax_detail values(${value.id}, '${value.pay_ym}', ${value.pay_amt}, ${value.ord_num})`;

        db.query(query, function (err, results, fields) {
            if (err) throw err;

            chk = true;
        });
    }

    res.send({
        success: chk
    });
});

router.post("/user_bonus_income_tax", (req, res) => {
    let query = `select * from bonus_tax_mst where user_id = ${req.body.id}`;

    db.query(query, function (inner_err, results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send(results);
    });
});

router.post("/save_busi_income_tax", (req, res) => {
    let query = `insert business_tax values(${req.body.id}, ${req.body.pay_amt}, ${req.body.small_amounts})`
                + ` ON DUPLICATE KEY UPDATE `
                + ` pay_amt = ${req.body.pay_amt}, small_amounts = ${req.body.small_amounts}`;

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

router.post("/user_busi_income_tax", (req, res) => {
    let query = `select * from business_tax where user_id = ${req.body.id}`;

    db.query(query, function (inner_err, results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send(results);
    });
});

router.post("/save_major_tax", (req, res) => {
    let query = `insert major_tax values(${req.body.id}, '${req.body.major_type}', ${req.body.month_amt}, ${req.body.nontax_amt}, `
                + `'${req.body.job_gubun}', '${req.body.job_rate}', '${req.body.group_1}', '${req.body.group_2}', '${req.body.group_3}')`
                + ` ON DUPLICATE KEY UPDATE `
                + ` major_type = '${req.body.major_type}', month_amt = ${req.body.month_amt}, nontax_amt = ${req.body.nontax_amt},`
                + ` job_gubun = '${req.body.job_gubun}', job_rate = '${req.body.job_rate}',`
                + ` group_1 = '${req.body.group_1}', group_2 = '${req.body.group_2}', group_3 = '${req.body.group_3}'`;

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

router.post("/user_major_tax", (req, res) => {
    let query = `select * from major_tax where user_id = ${req.body.id} and major_type = '${req.body.major_type}'`;

    db.query(query, function (inner_err, results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send(results);
    });
});

router.post("/save_reti_income_tax", (req, res) => {
    let query = `insert reti_tax values(${req.body.id}, '${req.body.ert_date}', '${req.body.rert_date}', ${req.body.bonus_amt}, `
                + ` ${req.body.holiday_cnt}, ${req.body.holiday_amt}, '${req.body.last_dis}', '${req.body.cal_btn}')`
                + ` ON DUPLICATE KEY UPDATE `
                + ` start_date = '${req.body.ert_date}', end_date = '${req.body.rert_date}', bonus_amt = ${req.body.bonus_amt},`
                + ` holi_count = ${req.body.holiday_cnt}, holi_amt = ${req.body.holiday_amt}, last_dis = '${req.body.last_dis}', cal_btn  = '${req.body.cal_btn}'`;

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

router.post("/user_reti_income_tax", (req, res) => {
    let query = `select * from reti_tax where user_id = ${req.body.id}`;

    db.query(query, function (inner_err, results, inner_fields) {
        if (inner_err) throw inner_err;

        query = `select * from reti_tax_dtl where user_id = ${req.body.id} order by idx`;

        db.query(query, function (err, r, inner_fields) {
            if (err) throw err;

            res.send([results, r]);
        });
    });
});

router.post("/save_reti_income_tax_dtl", (req, res) => {
    let query = `insert reti_tax_dtl values(${req.body.id}, ${req.body.idx}, '${req.body.start_date}', '${req.body.end_date}', `
                + ` ${req.body.month_amt}, ${req.body.nontax_amt})`
                + ` ON DUPLICATE KEY UPDATE `
                + ` start_date = '${req.body.start_date}', end_date = '${req.body.end_date}', month_amt = ${req.body.month_amt},`
                + ` nontax_amt = ${req.body.nontax_amt}`;

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;

        res.send({
            success: true
        });
    });
});

router.post("/delete_save_data", (req, res) => {
    let query = [
        `delete from income_tax where user_id = ${req.body.id}`, `delete from bonus_tax_mst where user_id = ${req.body.id}`, `delete from bonus_tax_detail where user_id = ${req.body.id}`,
        `delete from business_tax where user_id = ${req.body.id}`, `delete from major_tax where user_id = ${req.body.id}`, `delete from reti_tax where user_id = ${req.body.id}`, `delete from reti_tax_dtl where user_id = ${req.body.id}`
    ];

    for(let i=0;i<query.length;i++) {
        db.query(query[i], function (inner_err, inner_results, inner_fields) {
            if (inner_err) throw inner_err;
        });
    }

    res.send({
        success: true
    });
});

router.post("/delete_user_data", (req, res) => {
    let query =  `delete from user_info where user_id = ${req.body.id}`;

    console.log(query)

    db.query(query, function (inner_err, inner_results, inner_fields) {
        if (inner_err) throw inner_err;
    });

    res.send({
        success: true
    });
});

module.exports = router;