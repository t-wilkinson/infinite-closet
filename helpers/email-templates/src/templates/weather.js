import React from 'react'

import Grid from '../layout/Grid'
import Header from '../elements/Header'
import Title from '../elements/Title'
import Body from '../elements/Body'
import Footer from '../elements/Footer'
import Layout from '../layout'
import format from 'date-fns/format'
import Img from '../elements/Img'

// function getWeatherInMadrid() {
//   return fetch('https://www.metaweather.com/api/location/766273/')
//     .then((res) => res.json())
//     .then((res) => {
//       return res.consolidated_weather.map((w) => ({
//         date: w.applicable_date,
//         name: w.weather_state_name,
//         abbr: w.weather_state_abbr,
//         tMax: w.max_temp,
//         tMin: w.min_temp,
//       }))
//     })
// }

export const fetchData = () => {
  // return getWeatherInMadrid().then((weather) => {
  return { city: 'Madrid' }
  // })
}

const style = {
  container: {
    color: '#333',
  },

  todayContainer: {
    width: 'auto',
    margin: '0 auto',
  },

  todayBody: {
    marginLeft: '20px',
  },

  todayName: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },

  todayTemp: {
    fontSize: '14px',
    margin: 0,
    color: '#8a8a8a',
    lineHeight: '1.5',
  },

  title: {
    fontSize: '16px',
    margin: '20px 0 10px 0',
    textAlign: 'center',
  },

  forecastContainer: {
    margin: '0 auto',
    width: 'auto',
  },

  weatherContainer: {
    marginBottom: '10px',
    width: 'auto',
  },

  weatherIcon: {
    width: '32px',
    height: '32px',
    marginRight: '20px',
  },

  weatherBody: {
    maxWidth: '280px',
  },

  weatherDate: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0,
  },

  weatherName: {
    fontSize: '18px',
    margin: '3px 0 2px 0',
  },

  weatherTemp: {
    fontSize: '12px',
    color: '#8a8a8a',
    lineHeight: '1.5',
    margin: 0,
  },
}

function Icon({ abbr, style }) {
  return (
    <Img
      style={style}
      src={`https://www.metaweather.com/static/img/weather/png/64/${abbr}.png`}
      alt={abbr}
    />
  )
}

function Weather({ report }) {
  // The first element is today's date
  const [today, ...forecast] = report

  return (
    <Grid style={style.container}>
      <h2 style={style.title}>
        Today &mdash; {format(new Date(today.date), 'D/M')}
      </h2>

      <Grid.Cell>
        <Grid style={style.todayContainer}>
          <Grid.Row>
            <Icon abbr={today.abbr} />
            <Grid style={style.todayBody}>
              <p style={style.todayName}>{today.name}</p>
              <Grid>
                <Grid.Row>
                  <p style={style.todayTemp}>
                    Max: {Math.round(today.tMax)} &#8451;
                  </p>
                  <p style={style.todayTemp}>
                    Min: {Math.round(today.tMin)} &#8451;
                  </p>
                </Grid.Row>
              </Grid>
            </Grid>
          </Grid.Row>
        </Grid>
      </Grid.Cell>

      <h2 style={style.title}>Forecast</h2>
      <Grid.Cell>
        <Grid style={style.forecastContainer}>
          {/* {forecast.map(weather => ( */}
          {/*   <Grid style={style.weatherContainer} key={weather.date}> */}
          {/*     <Grid.Row> */}
          {/*       <Icon style={style.weatherIcon} abbr={weather.abbr} /> */}
          {/*       <Grid style={style.weatherBody}> */}
          {/*         <p style={style.weatherDate}> */}
          {/*           {format(new Date(weather.date), 'dddd, MMMM Do')} */}
          {/*         </p> */}
          {/*         <p style={style.weatherName}> */}
          {/*           {weather.name} */}
          {/*         </p> */}
          {/*         <Grid> */}
          {/*           <Grid.Row> */}
          {/*             <p style={style.weatherTemp}> */}
          {/*               Max: {Math.round(weather.tMax)} &#8451; */}
          {/*             </p> */}
          {/*             <p style={style.weatherTemp}> */}
          {/*               Min: {Math.round(weather.tMin)} &#8451; */}
          {/*             </p> */}
          {/*           </Grid.Row> */}
          {/*         </Grid> */}
          {/*       </Grid> */}
          {/*     </Grid.Row> */}
          {/*   </Grid> */}
          {/* ))} */}
        </Grid>
      </Grid.Cell>
    </Grid>
  )
}

export function Email({ data }) {
  return (
    <Layout>
      <Header />
      <Body>
        <h2 className="text-2xl font-header">Testing</h2>
        <Title>Weather report for {data.city}</Title>
        {/* <Weather report={data.weather} /> */}
      </Body>
      <Footer />
    </Layout>
  )
}
