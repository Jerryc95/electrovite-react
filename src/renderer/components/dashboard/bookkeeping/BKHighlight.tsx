import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  // Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { BKEntry } from 'src/models/BKEntry';

interface BKHighlightProps {
  highlight: string;
  entries: BKEntry[];
}

interface IChartData {
  date: Date;
  amount: number;
}

const BKHighlight: React.FC<BKHighlightProps> = ({ highlight, entries }) => {
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [chartColor, setChartColor] = useState('');

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  useEffect(() => {
    let rawChartData: IChartData[] = [];
    let totalAmount = 0;
    switch (highlight) {
      case 'Revenue': {
        totalAmount = 0;
        rawChartData = [];
        const sortedEntries = entries.sort((a, b) => {
          return (
            dateParser(a.entry_date).getTime() -
            dateParser(b.entry_date).getTime()
          );
        });
        sortedEntries.forEach((entry) => {
          totalAmount += parseFloat(entry.total_amount);
          rawChartData.push({
            date: entry.entry_date,
            amount: totalAmount,
          });
        });

        setChartData(rawChartData);
        setTotal(totalAmount);
        setChartColor('#560bad');
        break;
      }

      case 'Profit': {
        rawChartData = [];
        let profit = 0;

        const sortedEntries = entries.sort((a, b) => {
          return (
            dateParser(a.entry_date).getTime() -
            dateParser(b.entry_date).getTime()
          );
        });

        sortedEntries.reduce<BKEntry[]>((acc, entry) => {
          const entryDate = entry.entry_date;
          const existingEntry = acc.find((e) => e.entry_date === entryDate);

          if (existingEntry) {
            if (existingEntry.transaction_type === 'Income') {
              profit += parseFloat(existingEntry.total_amount);
            } else {
              profit -= parseFloat(existingEntry.total_amount);
            }
            const newChartData: IChartData = {
              date: existingEntry.entry_date,
              amount: profit,
            };
            rawChartData.push(newChartData);
          } else {
            if (entry.transaction_type === 'Income') {
              profit += parseFloat(entry.total_amount);
            } else {
              profit -= parseFloat(entry.total_amount);
            }
            const newChartData: IChartData = {
              date: entryDate,
              amount: profit,
            };
            rawChartData.push(newChartData);
          }
          setTotal(profit);
        
          return acc;
        }, []);

        setChartData(rawChartData);
        setChartColor('#4895ef');
        break;
      }

      case 'Outstanding': {
        rawChartData = [];
        totalAmount = 0;
        const sortedEntries = entries.sort((a, b) => {
          return (
            dateParser(a.entry_date).getTime() -
            dateParser(b.entry_date).getTime()
          );
        });
        sortedEntries.forEach((entry) => {
          totalAmount += parseFloat(entry.outstanding_amount);
          rawChartData.push({
            date: entry.entry_date,
            amount: totalAmount,
          });
        });

        setTotal(totalAmount);
        setChartData(rawChartData);
        setChartColor('#4361ee');
        break;
      }

      case 'Expense': {
        rawChartData = [];
        totalAmount = 0;
        const sortedEntries = entries.sort((a, b) => {
          return (
            dateParser(a.entry_date).getTime() -
            dateParser(b.entry_date).getTime()
          );
        });
        sortedEntries.forEach((entry) => {
          totalAmount += parseFloat(entry.total_amount);
          rawChartData.push({
            date: entry.entry_date,
            amount: totalAmount,
          });
        });

        setTotal(totalAmount);
        setChartData(rawChartData);
        setChartColor('#f72585');
        break;
      }
    }
    if(entries.length === 0) {
      setTotal(0)
    }
  }, [entries, highlight]);

  return (
    <div
      className={`BKHighlight-container ${highlight}`}
      onClick={() => console.log(total)}
    >
      <div className='BKHighlight-header'>
        <h3>{highlight}</h3>
        <h4>
          ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h4>
      </div>
      <ResponsiveContainer width='100%' height='80%'>
        <AreaChart width={400} height={350} data={chartData}>
          <defs>
            <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='1%' stopColor={chartColor} stopOpacity={1} />
              <stop offset='95%' stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* <Tooltip /> */}
          <Area
            type='monotone'
            dataKey='amount'
            stroke={chartColor}
            // fill='url(#chartGradient)'
            fill={chartColor}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BKHighlight;
