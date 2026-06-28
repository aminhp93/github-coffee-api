import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { data, range = '2026' } = body;

  // Extract base parameters from interactive data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const incomeRow = data.find((r: Record<string, any>) => r.category.includes('Salary'));
  const mortgageRow = data.find((r: Record<string, any>) => r.category.includes('Mortgage'));
  const insuranceRow = data.find((r: Record<string, any>) => r.category.includes('Insurance'));
  const livingRow = data.find((r: Record<string, any>) => r.category.includes('Living'));
  const sinkingRow = data.find((r: Record<string, any>) => r.category.includes('Sinking'));
  const goldRow = data.find((r: Record<string, any>) => r.category.includes('Gold'));

  const baseHusbandSalary = incomeRow?.minh || 58.0;
  const baseWifeSalary = incomeRow?.nhi || 13.0;
  
  const baseFixedExpenses = (mortgageRow?.minh || 0) + (mortgageRow?.nhi || 0) +
                            (insuranceRow?.minh || 0) + (insuranceRow?.nhi || 0) +
                            (livingRow?.minh || 0) + (livingRow?.nhi || 0) +
                            (sinkingRow?.minh || 0) + (sinkingRow?.nhi || 0);

  const baseGoldSavings = (goldRow?.minh || 0) + (goldRow?.nhi || 0);

  // Salary History (for accumulated months and MBQTL)
  // 10/2022 - 02/2026 is 41 months
  let accumulatedMonths = 40; // As of Jan 1, 2026
  
  // Salary history mapping for MBQTL calculation (simplified as current avg of last few years)
  // History: 29.8 (9), 33 (2), 36 (10), 36.5 (7), 40 (8), 46.8 (5)
  // Total paid until Jan 2026: (29.8*9 + 33*2 + 36*10 + 36.5*7 + 40*8 + 46.8*4) = approx 1450M
  let totalSalaryPaid = 1450.0; 

  const startYear = 2026;
  const startMonth = 1;
  
  let endYear = 2026;
  let endMonth = 12;

  if (range === '2028') {
    endYear = 2028;
    endMonth = 8;
  } else if (range === '2033') {
    endYear = 2033;
    endMonth = 3;
  }

  const timeline = [];
  let currentCash = 100.0;
  let currentGold = 0.0;
  const stockFund = 300.0;
  const goldPrice = 180.0;
  const region1MinSalary = 5.31;

  const specialCash: Record<string, number> = {
    '2026-2': 100.0,
    '2026-6': -100.0,
    '2026-9': -50.0,
  };

  const specialGold: Record<string, number> = {
    '2026-2': 3.1,
  };

  const specialNotes: Record<string, string> = {
    '2026-2': "Wedding Gift (+100M VND | +3.1 Taels gold)",
    '2026-6': "Buy Car (−100M)",
    '2026-9': "Baby Prep (−50M)",
  };

  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${month}`;
    
    // Income Logic
    let husbandIncome = baseHusbandSalary;
    if (year === 2026 && month < 5) {
        husbandIncome = Math.max(0, baseHusbandSalary - 16.0); 
    }
    const totalIncome = husbandIncome + baseWifeSalary;

    // Insurance Accumulated Months (Husband)
    accumulatedMonths++;
    totalSalaryPaid += husbandIncome;

    // BHTN Calculation
    // Benefit = Avg last 6mo * 60% (Max 5x MinSalary)
    // Avg last 6mo is roughly current husband income
    const bhtnMonthly = Math.min(husbandIncome * 0.6, region1MinSalary * 5);
    let bhtnMonths = 3;
    if (accumulatedMonths > 36) {
        bhtnMonths += Math.floor((accumulatedMonths - 36) / 12);
    }
    bhtnMonths = Math.min(bhtnMonths, 12);
    const bhtnTotal = bhtnMonthly * bhtnMonths;

    // BHXH 1 Lan Calculation
    // Amount = 2 * MBQTL * YearsAfter2014
    const mbqtl = totalSalaryPaid / accumulatedMonths;
    const bhxhYears = accumulatedMonths / 12;
    // Rounding: 1-6mo = 0.5yr, 7-11mo = 1yr
    const remainingMo = accumulatedMonths % 12;
    let roundedYears = Math.floor(bhxhYears);
    if (remainingMo >= 1 && remainingMo <= 6) roundedYears += 0.5;
    else if (remainingMo >= 7) roundedYears += 1;
    
    const bhxhTotal = 2 * mbqtl * roundedYears;

    // Expenses Logic
    let fixedExpenses = baseFixedExpenses;
    if (year > 2026 || (year === 2026 && month >= 12)) {
        if (year >= 2027) fixedExpenses += 10.0;
    }
    
    let specialAmt = specialCash[key] || 0;
    let bonusAmt = 0;

    // Yearly Bonus (Jan)
    if (month === 1) {
      bonusAmt = totalIncome;
      specialAmt += bonusAmt;
    }

    // Gold savings
    let goldDelta = specialGold[key] || 0;
    let goldCost = 0;
    if (year > 2026 || (year === 2026 && month >= 5)) {
      goldDelta += baseGoldSavings / goldPrice;
      goldCost = baseGoldSavings;
    }

    // Net Cash Flow
    const netCF = totalIncome - fixedExpenses + specialAmt - goldCost;
    currentCash += netCF;
    currentGold += goldDelta;

    const totalLiquid = currentCash + (currentGold * goldPrice) + stockFund;

    timeline.push({
      month: `${month}/${year}`,
      totalIncome,
      fixedExpenses,
      specialAmt,
      specialNote: (specialNotes[key] || "") + (bonusAmt > 0 ? (specialNotes[key] ? " | " : "") + `Bonus (+${bonusAmt.toFixed(1)}M)` : ""),
      netCF,
      endingCash: currentCash,
      goldCumulative: currentGold,
      totalLiquid,
      bhtn: bhtnTotal,
      bhxh: bhxhTotal
    });

    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return NextResponse.json(timeline);
}
