'use client'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useRef, useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
)

const BarChart = ({ data }: { data: any }) => {
  const chartRef = useRef<any>(null);
  const [images, setImages] = useState<any>({})
  useEffect(() => {
    const images_: { [index: number]: any } = {};
    const loadImages = async () => {
      const imagePromises = data.labels.map((label: string, index: number) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const image = new Image()
          image.src = '/emotes/' + label + '.png'
          image.onload = () => {
            images_[index] = image
            resolve(image)
          }
          image.onerror = () => {
            resolve(null as any)
          }
        });
      });
      await Promise.all(imagePromises);
      setImages(images_);
    }
    loadImages();
  }, [data.labels])

  return (
    <Bar
      ref={chartRef}
      redraw={true}
      options={{
        scales: {
          x: {
            stacked: true,
            ticks: {
              autoSkip: false,
              padding: 30,
            }
          },
          y: {
            stacked: true,
          },
        },
      }}
      plugins={[
        {
          id: 'label',
          afterDraw: (chart: any) => {
            const ctx = chart.ctx
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;
            xAxis.ticks.forEach((value: any, index: any) => {
              const image = images[index]
              if (!image) return
              const tickX = xAxis.getPixelForTick(index);
              let categoryWidth;
              if (index < xAxis.ticks.length - 1) {
                categoryWidth = xAxis.getPixelForTick(index + 1) - tickX;
              } else {
                categoryWidth = (xAxis.right - tickX) * 2;
              }
              const emoteWidth = Math.min(categoryWidth - 2, 30);
              const x = tickX - emoteWidth / 2;
              const y = yAxis.bottom + 5;
              ctx.drawImage(images[index], x, y, emoteWidth, emoteWidth);
            });
          },
        },
      ]}
      data={data}
    />
  )
}

export default BarChart
