/* eslint-disable no-console */
import { NavHistoryResponse } from "@/@core/services/f-market/schema";
import dayjs from "dayjs";

export function mapData(result: NavHistoryResponse) {
  // validate data
  const data = result.data;
  // uniq data by key navDate, get the first one
  const validatedData = Object.values(data.reduce((acc: { [key: string]: typeof data[0] }, cur) => {
    if (!acc[cur.navDate]) {
      acc[cur.navDate] = cur;
    }
    return acc;
  }, {}));

  console.log('validatedData', validatedData)


    const INIT_NAV = 1;
    let navAll = INIT_NAV;
    let navFirstOfMonth = INIT_NAV;
    let navLastOfMonth = INIT_NAV;

    const listDate = validatedData.map(i => dayjs(i.navDate))

 // Define the type for the accumulator object
 type DateMap = { [key: string]: dayjs.Dayjs };

 // filter only the smallest date in same month and year. For example, [2022-01-01, 2022-01-02, 2022-01-03] will return [2022-01-01]
 const smallestDateInMonth = Object.values(listDate
     .reduce((acc: DateMap, date) => {
         const key = date.format("YYYY-MM");
         if (!acc[key] || date.isBefore(acc[key])) {
             acc[key] = date;
         }
         return acc;
     }, {}))
     .map(date => date.format("YYYY-MM-DD"));


 // filter only the largest date in same month and year. For example, [2022-01-01, 2022-01-02, 2022-01-03] will return [2022-01-03]
 const largestDateInMonth = Object.values(listDate
     .reduce((acc: DateMap, date) => {
         const key = date.format("YYYY-MM");
         if (!acc[key] || date.isAfter(acc[key])) {
             acc[key] = date;
         }
         return acc;
     }, {}))
     .map(date => date.format("YYYY-MM-DD"));

     console.log('smallestDateInMonth', smallestDateInMonth, 'largestDateInMonth', largestDateInMonth)

    // eslint-disable-next-line no-console
    console.log("result", result);
    const xxx = validatedData.map((i, index) => {
      // Validate data
      const currentNav = i.nav;
      let navChange;
      let navChangePercent;
      let firstOfMonth = false
        let lastOfMonth = false
      
      
      if (index > 0) {
        const previousNav = validatedData[index - 1].nav;
        navChange = currentNav - previousNav;
        navChangePercent = (navChange / previousNav) * 100;
      }

      if (navChangePercent !== undefined) {

      navAll = navAll * (1 + navChangePercent / 100);
      }

    //   if date in smallestDateInMonth, set check to true
        if (smallestDateInMonth.includes(dayjs(i.navDate).format("YYYY-MM-DD"))) {
            firstOfMonth = true
            if (navChangePercent !== undefined) {
                navFirstOfMonth = navFirstOfMonth * (1 + navChangePercent / 100);
            }
        }

    //   if date in largestDateInMonth, set check to true
        if (largestDateInMonth.includes(dayjs(i.navDate).format("YYYY-MM-DD"))) {
            lastOfMonth = true
            if (navChangePercent !== undefined) {
                navLastOfMonth = navLastOfMonth * (1 + navChangePercent / 100);
            }
        }

  
      return {
        ...i,
        navChange,
        navChangePercent,
        navAll,
        firstOfMonth,
        navFirstOfMonth: firstOfMonth ? navFirstOfMonth : undefined,
        lastOfMonth,
        navLastOfMonth: lastOfMonth ? navLastOfMonth : undefined,
      };
    });

    console.log('xxx', xxx)

    return xxx
  }
  