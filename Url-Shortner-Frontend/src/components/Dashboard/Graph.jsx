
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend,
  Filler
);

const Graph = ({ graphData }) => {
  const labels = graphData?.map((item, i) => `${item.clickDate}`);
  const userPerDaya = graphData?.map((item) => item.count);

  const data = {
    labels:
     graphData.length > 0
        ? labels
        : ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Total Clicks",
        data:
         graphData.length > 0
            ? userPerDaya
            : [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
        backgroundColor:
         graphData.length > 0 ? "#2563EB" : "rgba(37, 99, 235, 0.1)",
        borderColor: "transparent",
        pointBorderColor: "transparent",
        fill: true,
        tension: 0.4,
        barThickness: 24,
        borderRadius: 4,
        categoryPercentage: 1.5,
        barPercentage: 1.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        padding: 12,
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 13, family: 'Inter' },
        cornerRadius: 6,
      }
    },
    scales: {
      y: {
        border: { dash: [4, 4] },
        grid: {
          color: '#E2E8F0',
          drawBorder: false,
        },
        beginAtZero: true,
        ticks: {
          // stepSize: 1,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value.toString();
            }
            return "";
          },
        },
        title: {
          display: true,
          text: "Number of Clicks",
          font: {
            family: "Inter, sans-serif",
            size: 13,
            weight: "500",
          },
          color: "#64748B",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Date",
          font: {
            family: "Inter, sans-serif",
            size: 13,
            weight: "500",
          },
          color: "#64748B",
        },
      },
    },
  };

  return <Bar className=" w-full" data={data} options={options}></Bar>;
};

export default Graph;
