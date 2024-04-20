import { useState, useEffect } from "react"
import { MapContainer, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import pattern from "./images/pattern-bg.png"
import arrow from "./images/icon-arrow.svg"
import Markerposition from "./Markerposition"

function App() {
  const [address, setAddress] = useState(null)
  const [ipAddress, setIpAddress] = useState("")
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/


    useEffect(() => {
      try {
        const getInitialData = async () => {
          const res = await fetch(
            `https://geo.ipify.org/api/v2/country,city?apiKey=at_FUHxgWgKodgKX4EmZFkJ4FOh9kPV7&ipAddress=8.8.8.8`
          )
          const data = await res.json()
          setAddress(data)
        }
  
        getInitialData()
      } catch (error) {
        console.trace(error)
      }
    }, [])
  
    const getEnteredData = async () => {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_FUHxgWgKodgKX4EmZFkJ4FOh9kPV7&${
          checkIpAddress.test(ipAddress)
            ? `ipAddress=${ipAddress}`
            : checkDomain.test(ipAddress)
            ? `domain=${ipAddress}`
            : ""
        }`
      )
      const data = await res.json()
      setAddress(data)
    }
  function handleSubmit(e) {
    e.preventDefault()
    getEnteredData()
    setIpAddress("")
  }

  return (

    <section>

      <div className="absolute img -z-10">
        <img src={pattern} alt="" />
      </div>

      <article className="p-8">

        <h1 className="text-white text-2xl lg:text-3xl text-center my-4">
          IP Address Tracker
        </h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="max-w-2xl flex 
        m-auto mt-auto">

          <input type="text" name="ipaddress" id="ipaddress"
            placeholder="Search for any IP address or domain" required
            className="py-3 px-4 rounded-l-lg w-full"
            value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />

          <button type="submit" className="bg-black py-3 px-4
        hover:opacity-75 rounded-r-lg flex items-center">
            <img src={arrow} alt="" />
          </button>

        </form>

      </article>


      {address && <>
        <article className="relative bg-white font-bold rounded-lg shadow p-8 mx-8 grid grid-cols-1 
      gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left
      lg:-mb-20 md:-mb-36 sm:-mb-44 xs:-mb-68 2xs:-mb-52 max-h-2xl"
          style={{ zIndex: 10000 }}>

          <div className="lg:border-r lg:border-dark-gray 2xs:-mt-4 md:-mt-0 lg:-mt-0">
            <h2 className="uppercase text-dark-gray font-body-bold tracking-wider mb-3 text-sm 2xs:text-xs">
              IP Address
            </h2>

            <p className="text-very-dark-gray xl:text-2xl 2xs:-mt-2 2xs:text-2xl">
              {address.ip}
            </p>
          </div>

          <div className="lg:border-r lg:border-dark-gray 2xs:-mt-4 md:-mt-0 lg:-mt-0">
            <h2 className="uppercase text-dark-gray font-body-bold tracking-wider mb-3 text-sm 2xs:text-xs">
              Location
            </h2>

            <p className="text-very-dark-gray xl:text-2xl 2xs:-mt-2 2xs:text-2xl">
              {address.location.city},{address.location.region}
            </p>
          </div>

          <div className="lg:border-r lg:border-dark-gray 2xs:-mt-4 md:-mt-0 lg:-mt-0">
            <h2 className="uppercase text-dark-gray font-body-bold tracking-wider mb-3 text-sm 2xs:text-xs">
              Timezone
            </h2>

            <p className="text-very-dark-gray xl:text-2xl 2xs:-mt-2 2xs:text-2xl">
              UTC -{address.location.timezone}
            </p>
          </div>

          <div className="2xs:-mt-4 2xs:-mb-4 md:-mt-0 lg:-mt-0">
            <h2 className="uppercase text-dark-gray font-body-bold tracking-wider mb-3 text-sm 2xs:text-xs">
              isp
            </h2>

            <p className="text-very-dark-gray xl:text-2xl 2xs:-mt-2 2xs:text-2xl">
              {address.isp}
            </p>
          </div>
        </article>


        <div className="-z-10">
          <MapContainer center={[address.location.lat, address.location.lng]} zoom={13} scrollWheelZoom={true}
            style={{ height: "700px", width: "100vw" }}>

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
        OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Markerposition address={address} />
          </MapContainer>
        </div>
      </>
      }
    </section>

  );
}

export default App;
