import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "../Page/MainPage";
import SettingPage from '../Page/SettingPage';
import IncomeTaxPage from "../Page/IncomeTaxPage";
import BonusIncomeTaxPage from "../Page/BonusIncomeTaxPage";
import BussinessTaxPage from "../Page/BusinessIncomeTaxPage";
import MajorTaxPage from "../Page/MajorTaxPage";
import RetireIncomeTax from '../Page/RetireIncomeTax';

const Router = () => {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/income_tax_calc" element={<IncomeTaxPage />} />
            <Route path="/bonus_income_tax_calc" element={<BonusIncomeTaxPage />} />
            <Route path="/business_income_tax_calc" element={<BussinessTaxPage />} />
            <Route path="/major_insur_calc" element={<MajorTaxPage />} />
            <Route path="/retire_income_tax_calc" element={<RetireIncomeTax />} />
          </Routes>
      </BrowserRouter>
    );
  };

  export default Router;