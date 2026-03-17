// ============================================================================
// ПРОВЕРКА ПАРОЛЯ
// ============================================================================
const SITE_PASSWORD = '';

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const overlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('mainContent');
    const error = document.getElementById('loginError');

    if (input === SITE_PASSWORD) {
        overlay.style.display = 'none';
        mainContent.style.display = 'block';
        sessionStorage.setItem('isLoggedIn', 'true');
        calculate();
    } else {
        error.style.display = 'block';
        error.textContent = 'Неверный пароль!';
    }
}

// Проверка при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const overlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('mainContent');

    if (isLoggedIn === 'true') {
        overlay.style.display = 'none';
        mainContent.style.display = 'block';
        calculate();
    } else {
        overlay.style.display = 'flex';
        mainContent.style.display = 'none';
    }
});

// Вход по Enter
document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

// ============================================================================
// КОНСТАНТЫ (из Delphi-кода)
// ============================================================================
const CA_PER_GH = 7.1446;
const MG_PER_GH = 4.3062;

const C_CASO4_2H2O = 0.030702;
const C_CACL2 = 0.019786;
const C_CACL2_2H2O = 0.026205;
const C_CACL2_6H2O = 0.039058;

const C_MGSO4_7H2O = 0.043669;
const C_MGSO4 = 0.021325;
const C_MGCL2_6H2O = 0.035999;

const C_K2SO4 = 0.002228;
const C_KCL = 0.001907;
const C_K2CO3 = 0.001767;
const TARGET_K_PPM = 3.0;

const C_NAHCO3_PER_DKH = 0.029994;

const M_CA = 40.078;
const M_MG = 24.305;
const M_NA = 22.990;
const M_HCO3 = 61.017;
const M_SO4 = 96.0626;
const M_CL = 35.453;
const M_CL2 = 70.906;
const M_CASO4_2H2O = 172.172;
const M_CACL2 = 110.984;
const M_CACL2_2H2O = 147.014;
const M_CACL2_6H2O = 219.084;
const M_MGSO4_7H2O = 246.475;
const M_MGSO4 = 120.368;
const M_MGCL2_6H2O = 203.303;
const M_NAHCO3 = 84.007;
const M_K2SO4 = 174.259;
const M_KCL = 74.5513;
const M_K2CO3 = 138.205;

const GH_TO_CACO3 = 17.848;
const KH_TO_CACO3 = 17.848;

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ РАСЧЁТА
// ============================================================================
function calculate() {
    const gh = parseFloat(document.getElementById('editHardness').value.replace(',', '.')) || 0;
    const kh = parseFloat(document.getElementById('editKH').value.replace(',', '.')) || 0;
    const volume = parseFloat(document.getElementById('editVolume').value.replace(',', '.')) || 0;
    let targetRatio = parseFloat(document.getElementById('Ca_Mg').value.replace(',', '.')) || 0;
    if (targetRatio <= 0) targetRatio = 1.11;

    const caSaltIndex = parseInt(document.getElementById('CaBox').value);
    const mgSaltIndex = parseInt(document.getElementById('MgBox').value);
    const kSaltIndex = parseInt(document.getElementById('KBox').value);

    // Обновление названий препаратов
    const caSaltNames = ['CaSO₄·2H₂O', 'CaCl₂', 'CaCl₂·2H₂O', 'CaCl₂·6H₂O'];
    const mgSaltNames = ['MgSO₄·7H₂O', 'MgSO₄', 'MgCl₂·6H₂O'];
    const kSaltNames = ['K₂SO₄', 'KCl', 'K₂CO₃'];

    if (document.getElementById('saltCaName')) {
        document.getElementById('saltCaName').textContent = caSaltNames[caSaltIndex] || 'CaSO₄·2H₂O';
    }
    if (document.getElementById('saltMgName')) {
        document.getElementById('saltMgName').textContent = mgSaltNames[mgSaltIndex] || 'MgSO₄·7H₂O';
    }
    if (document.getElementById('saltKName')) {
        document.getElementById('saltKName').textContent = kSaltNames[kSaltIndex] || 'KCl';
    }

    // Распределение GH по ионам
    const mgPartGh = gh / (targetRatio * MG_PER_GH / CA_PER_GH + 1);
    const caPartGh = gh - mgPartGh;

    // Расчёт масс солей
    let caGrams = 0, mgGrams = 0;

    switch (caSaltIndex) {
        case 0: caGrams = C_CASO4_2H2O * caPartGh * volume; break;
        case 1: caGrams = C_CACL2 * caPartGh * volume; break;
        case 2: caGrams = C_CACL2_2H2O * caPartGh * volume; break;
        case 3: caGrams = C_CACL2_6H2O * caPartGh * volume; break;
    }

    switch (mgSaltIndex) {
        case 0: mgGrams = C_MGSO4_7H2O * mgPartGh * volume; break;
        case 1: mgGrams = C_MGSO4 * mgPartGh * volume; break;
        case 2: mgGrams = C_MGCL2_6H2O * mgPartGh * volume; break;
    }

    // Расчёт ppm ионов
    let caPpm = 0, mgPpm = 0, so4Ppm = 0, clPpm = 0;

    switch (caSaltIndex) {
        case 0:
            caPpm = caGrams * M_CA / M_CASO4_2H2O * 1000 / volume;
            so4Ppm = caGrams * M_SO4 / M_CASO4_2H2O * 1000 / volume;
            break;
        case 1:
            caPpm = caGrams * M_CA / M_CACL2 * 1000 / volume;
            clPpm = caGrams * M_CL2 / M_CACL2 * 1000 / volume;
            break;
        case 2:
            caPpm = caGrams * M_CA / M_CACL2_2H2O * 1000 / volume;
            clPpm = caGrams * M_CL2 / M_CACL2_2H2O * 1000 / volume;
            break;
        case 3:
            caPpm = caGrams * M_CA / M_CACL2_6H2O * 1000 / volume;
            clPpm = caGrams * M_CL2 / M_CACL2_6H2O * 1000 / volume;
            break;
    }

    switch (mgSaltIndex) {
        case 0:
            mgPpm = mgGrams * M_MG / M_MGSO4_7H2O * 1000 / volume;
            so4Ppm += mgGrams * M_SO4 / M_MGSO4_7H2O * 1000 / volume;
            break;
        case 1:
            mgPpm = mgGrams * M_MG / M_MGSO4 * 1000 / volume;
            so4Ppm += mgGrams * M_SO4 / M_MGSO4 * 1000 / volume;
            break;
        case 2:
            mgPpm = mgGrams * M_MG / M_MGCL2_6H2O * 1000 / volume;
            clPpm += mgGrams * M_CL2 / M_MGCL2_6H2O * 1000 / volume;
            break;
    }

    // Калий
    let kSaltMass = 0, kKhContrib = 0;
    switch (kSaltIndex) {
        case 0:
            kSaltMass = C_K2SO4 * TARGET_K_PPM * volume;
            so4Ppm += kSaltMass * M_SO4 / M_K2SO4 * 1000 / volume;
            break;
        case 1:
            kSaltMass = C_KCL * TARGET_K_PPM * volume;
            clPpm += kSaltMass * M_CL / M_KCL * 1000 / volume;
            break;
        case 2:
            kSaltMass = C_K2CO3 * TARGET_K_PPM * volume;
            kKhContrib = kSaltMass * 0.722 * 1000 / volume / KH_TO_CACO3;
            break;
        default:
            kSaltMass = C_K2SO4 * TARGET_K_PPM * volume;
            so4Ppm += kSaltMass * M_SO4 / M_K2SO4 * 1000 / volume;
    }

    // Бикарбонат (KH)
    const nahco3Grams = C_NAHCO3_PER_DKH * kh * volume;
    const naPpm = nahco3Grams * M_NA / M_NAHCO3 * 1000 / volume;
    const hco3Ppm = nahco3Grams * M_HCO3 / M_NAHCO3 * 1000 / volume;

    // TDS
    const totalTds = caPpm + mgPpm + naPpm + TARGET_K_PPM + hco3Ppm + so4Ppm + clPpm;
    const thCaco3 = gh * GH_TO_CACO3;

    // Форматирование чисел (ТОЧКИ вместо запятых)
    const fmt = (num, decimals = 2) => num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    // Дозировки солей
    document.getElementById('lblCaValue').textContent = `${fmt(caGrams)} г`;
    document.getElementById('lblMgValue').textContent = `${fmt(mgGrams)} г`;
    document.getElementById('lblNaHCO3Value').textContent = `${fmt(nahco3Grams)} г`;
    document.getElementById('Label_K').textContent = `${fmt(kSaltMass)} г`;
    document.getElementById('Label_Ka').textContent = `${fmt(TARGET_K_PPM, 1)} мг/л`;

    // Ионный состав
    document.getElementById('Label3').textContent = `${fmt(caPpm, 1)} мг/л`;
    document.getElementById('Label10').textContent = `${fmt(mgPpm, 1)} мг/л`;
    document.getElementById('Label_Na').textContent = `${fmt(naPpm, 1)} мг/л`;
    document.getElementById('Label_Ka').textContent = `${fmt(TARGET_K_PPM, 1)} мг/л`;
    document.getElementById('Label15').textContent = `${fmt(so4Ppm, 1)} мг/л`;
    document.getElementById('Label5').textContent = `${fmt(clPpm, 1)} мг/л`;
    document.getElementById('Label_HCO3').textContent = `${fmt(hco3Ppm, 1)} мг/л`;

    // Сводка
    document.getElementById('Label_TDC').textContent = `${fmt(totalTds, 1)} ppm`;
    document.getElementById('Label_TH_CaCO3').textContent = `${fmt(thCaco3, 0)} мг/л`;

    const totalKh = kh + kKhContrib;
    document.getElementById('Label_KH').textContent = `${fmt(totalKh, 2)} °dKH`;

    // Info bar
    let infoText = '';
    if (gh === 0) {
        infoText = `GH ≈ 0.0 | KH ≈ 0.0 | Ca:Mg ≈ 0.00:1`;
    } else if (mgPpm === 0) {
        infoText = `GH ≈ ${fmt(gh, 1)} | KH ≈ ${fmt(totalKh, 2)} | Ca:Mg ≈ ∞:1`;
    } else {
        const caMgRatio = caPpm / mgPpm;
        infoText = `GH ≈ ${fmt(gh, 1)} | KH ≈ ${fmt(totalKh, 2)} | Ca:Mg ≈ ${fmt(caMgRatio, 2)}:1 | V ≈ ${fmt(volume, 0)} л`;
    }
    document.getElementById('Label_info').textContent = infoText;

    saveSettings();
}

// ============================================================================
// СОХРАНЕНИЕ/ЗАГРУЗКА НАСТРОЕК
// ============================================================================
function saveSettings() {
    const settings = {
        gh: document.getElementById('editHardness').value,
        kh: document.getElementById('editKH').value,
        volume: document.getElementById('editVolume').value,
        caMgRatio: document.getElementById('Ca_Mg').value,
        caSalt: document.getElementById('CaBox').value,
        mgSalt: document.getElementById('MgBox').value,
        kSalt: document.getElementById('KBox').value
    };
    localStorage.setItem('aquacalc_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('aquacalc_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('editHardness').value = settings.gh || '6';
        document.getElementById('editKH').value = settings.kh || '2.0';
        document.getElementById('editVolume').value = settings.volume || '10';
        document.getElementById('Ca_Mg').value = settings.caMgRatio || '4';
        document.getElementById('CaBox').value = settings.caSalt || '0';
        document.getElementById('MgBox').value = settings.mgSalt || '0';
        document.getElementById('KBox').value = settings.kSalt || '0';
    }
}

function resetSettings() {
    localStorage.removeItem('aquacalc_settings');
    document.getElementById('editHardness').value = '6';
    document.getElementById('editKH').value = '2.0';
    document.getElementById('editVolume').value = '10';
    document.getElementById('Ca_Mg').value = '4';
    document.getElementById('CaBox').value = '0';
    document.getElementById('MgBox').value = '0';
    document.getElementById('KBox').value = '0';
    calculate();
}

// ============================================================================
// ЭКСПОРТ В HTML
// ============================================================================
function exportToHtml() {
    const now = new Date().toLocaleString('ru-RU');
    const getVal = (id) => document.getElementById(id).textContent;

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AquaCalc Log</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Consolas", "Courier New", monospace;
            max-width: 820px;
            margin: 0 auto;
            padding: 16px;
            background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
            color: #F0F9FF !important;
            line-height: 1.45;
            font-size: 15px;
            min-height: 100vh;
        }
        .header {
            text-align: center;
            padding: 18px 0;
            margin-bottom: 18px;
            border-bottom: 1px solid rgba(34, 211, 238, 0.3);
        }
        .header h1 {
            color: #22D3EE !important;
            font-size: 1.5em;
            margin-bottom: 6px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            color: #7DD3FC !important;
            font-size: 0.95em;
        }
        .section {
            background: linear-gradient(180deg, rgba(15, 52, 96, 0.98) 0%, rgba(8, 47, 73, 0.98) 100%);
            padding: 15px 18px;
            margin: 14px 0;
            border-radius: 9px;
            border: 1px solid rgba(34, 211, 238, 0.35);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .section h2 {
            color: #22D3EE !important;
            margin: 0 0 12px 0;
            padding-bottom: 9px;
            border-bottom: 1px solid rgba(34, 211, 238, 0.3);
            font-size: 1.15em;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: rgba(21, 94, 117, 0.9);
            color: #67E8F9 !important;
            padding: 10px 7px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            border: 1px solid rgba(34, 211, 238, 0.2);
        }
        td {
            padding: 10px 7px;
            border-bottom: 1px solid rgba(34, 211, 238, 0.15);
            color: #E0F2FE !important;
        }
        td:first-child {
            font-weight: 600;
            color: #7DD3FC !important;
        }
        td:last-child {
            text-align: right;
        }
        .value-box {
            background: linear-gradient(135deg, rgba(21, 94, 117, 0.95) 0%, rgba(15, 52, 96, 0.95) 100%);
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid rgba(34, 211, 238, 0.4);
            display: inline-block;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            color: #67E8F9 !important;
            font-weight: bold;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 12px 0 16px 0;
        }
        .summary-card {
            background: linear-gradient(180deg, rgba(21, 94, 117, 0.95) 0%, rgba(15, 52, 96, 0.95) 100%);
            padding: 18px 12px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid rgba(34, 211, 238, 0.4);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .summary-card .label {
            color: #22D3EE !important;
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 10px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .summary-card .value {
            color: #67E8F9 !important;
            font-size: 1.4em;
            font-weight: bold;
            font-family: "Consolas", monospace;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .footer {
            text-align: center;
            margin-top: 22px;
            padding-top: 16px;
            border-top: 1px solid rgba(34, 211, 238, 0.3);
            color: #7DD3FC !important;
            font-size: 0.9em;
        }
        @media (max-width: 600px) {
            .summary-grid { grid-template-columns: 1fr; }
            td, th { padding: 7px 5px; font-size: 0.9em; }
            body { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🐟 AQUACALC LOG</h1>
        <p>${now}</p>
    </div>

    <div class="section">
        <h2>ЖЕЛАЕМЫЕ ПАРАМЕТРЫ</h2>
        <table>
            <tr><td>Общая жёсткость (GH)</td><td><span class="value-box">${document.getElementById('editHardness').value} °dGH</span></td></tr>
            <tr><td>Карбонатная жёсткость (KH)</td><td><span class="value-box">${document.getElementById('editKH').value} °dKH</span></td></tr>
            <tr><td>Объём воды</td><td><span class="value-box">${document.getElementById('editVolume').value} л</span></td></tr>
            <tr><td>Соотношение Ca:Mg</td><td><span class="value-box">${document.getElementById('Ca_Mg').value} : 1</span></td></tr>
        </table>
    </div>

    <div class="section">
        <h2>НЕОБХОДИМО ВНЕСТИ</h2>
        <table>
            <tr><td>${getVal('saltCaName')}</td><td><span class="value-box">${getVal('lblCaValue')}</span></td></tr>
            <tr><td>${getVal('saltMgName')}</td><td><span class="value-box">${getVal('lblMgValue')}</span></td></tr>
            <tr><td>NaHCO₃</td><td><span class="value-box">${getVal('lblNaHCO3Value')}</span></td></tr>
            <tr><td>${getVal('saltKName')}</td><td><span class="value-box">${getVal('Label_K')}</span></td></tr>
        </table>
    </div>

    <div class="section">
        <h2>РЕЗУЛЬТАТЫ РАСЧЁТА</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="label">TDS</div>
                <div class="value">${getVal('Label_TDC')}</div>
            </div>
            <div class="summary-card">
                <div class="label">TH (CaCO₃)</div>
                <div class="value">${getVal('Label_TH_CaCO3')}</div>
            </div>
            <div class="summary-card">
                <div class="label">KH</div>
                <div class="value">${getVal('Label_KH')}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🔬 ИОННЫЙ СОСТАВ ВОДЫ</h2>
        <table>
            <tr><td>Ca²⁺</td><td>${getVal('Label3')}</td></tr>
            <tr><td>Mg²⁺</td><td>${getVal('Label10')}</td></tr>
            <tr><td>Na⁺</td><td>${getVal('Label_Na')}</td></tr>
            <tr><td>K⁺</td><td>${getVal('Label_Ka')}</td></tr>
            <tr><td>SO₄²⁻</td><td>${getVal('Label15')}</td></tr>
            <tr><td>Cl⁻</td><td>${getVal('Label5')}</td></tr>
            <tr><td>HCO₃⁻</td><td>${getVal('Label_HCO3')}</td></tr>
        </table>
    </div>

    <div class="footer">
        <p>PlecoHobby © ${new Date().getFullYear()}</p>
        <p>Профессионализм в каждой капле.</p>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquacalc_log_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================================
// МОДАЛЬНОЕ ОКНО
// ============================================================================
function setupModal() {
    const modal = document.getElementById('aboutModal');
    const btn = document.getElementById('btnAbout');
    const close = document.querySelector('.close');

    btn.addEventListener('click', () => modal.style.display = 'block');
    close.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    loadSettings();

    const inputs = ['editHardness', 'editKH', 'editVolume', 'Ca_Mg'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', calculate);
        // УБРАНА замена точки на запятую - теперь только точки
    });

    document.getElementById('CaBox').addEventListener('change', calculate);
    document.getElementById('MgBox').addEventListener('change', calculate);
    document.getElementById('KBox').addEventListener('change', calculate);

    document.getElementById('btnExport').addEventListener('click', exportToHtml);
    document.getElementById('btnReset').addEventListener('click', resetSettings);

    setupModal();
    calculate();
});