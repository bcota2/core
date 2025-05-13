import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export function BarChart({ data, labels, color }) {
  return (
    <Bar
      data={{
        labels: labels,
        datasets: [{
          label: 'Ventas',
          data: data,
          backgroundColor: color,
          borderRadius: 4
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }}
    />
  );
}

export function PieChart({ data, labels, colors }) {
  return (
    <Pie
      data={{
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }}
    />
  );
}