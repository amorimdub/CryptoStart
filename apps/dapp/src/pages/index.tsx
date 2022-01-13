// import HelloWorld from '@src/components/HelloWorld'

import React from 'react'
import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Home = () => {



  const handleNewStar = async (event: any) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.target).entries());
    // console.log(data)
    toast.promise(
      // eslint-disable-next-line no-promise-executor-return
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        pending: `Promise is pending ${data.name}`,
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    )

  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>



        <section className="w-full px-6 pb-12 antialiased bg-white">
          <div className="mx-auto max-w-7xl">

            <nav className="relative z-50 h-24 select-none">
              <div className="container relative flex flex-wrap items-center justify-between h-24 mx-auto overflow-hidden font-medium border-b border-gray-200 md:overflow-visible lg:justify-center sm:px-4 md:px-2">
                <a href="#_" className="inline-block py-4 md:py-0">
                  <span className="p-1 text-xl font-black leading-none text-gray-900"><span>CryptoStar</span><span className="text-indigo-700">.</span></span>
                </a>
              </div>
            </nav>
            <div className="container max-w-lg px-4 py-32 mx-auto text-left md:max-w-none md:text-center">
              <h1 className="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl"><span className="inline md:block">Start Crafting Your</span> <span className="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-indigo-600 md:inline-block">CryptoStar</span></h1>
            </div>
          </div>
        </section >


        <section className="w-full px-8 py-16 bg-gray-100 xl:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center md:flex-row">
              <div className="w-full mt-16 md:mt-0 md:w-2/5">
                <div className="relative z-10 h-auto p-8 py-10 overflow-hidden bg-white border-b-2 border-gray-300 rounded-lg shadow-2xl px-7">
                  <h3 className="mb-6 text-2xl font-medium text-center">Craft your CryptoStar</h3>
                  <form onSubmit={handleNewStar}>
                    <input type="text" name="name" required className="block w-full px-4 py-3 mb-4 border border-2  border-gray-200 rounded-lg focus:ring focus:ring-indigo-700 focus:outline-none" placeholder="Star Name" />
                    <input type="number" name="id" min="1" max="10" required className="block w-full px-4 py-3 mb-4 border border-2  border-gray-200 rounded-lg focus:ring focus:ring-indigo-700 focus:outline-none" placeholder="Star ID" />
                    <div className="block">
                      <button type="submit" className="w-full px-3 py-4 font-medium text-white bg-indigo-700 rounded-lg">Craft NOW! 👍</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="w-full space-y-5 md:w-3/5 md:pr-16 text-right">
                <p className="font-medium text-indigo-700 uppercase">Where will the funds go?</p>
                <h2 className="text-2xl font-extrabold leading-none text-black sm:text-3xl md:text-5xl" >This is a demo website</h2>
                <p className="text-xl text-gray-600 md:pl-16">This works on Rinkeby Ethereum network.</p>
              </div>

            </div>
          </div>
        </section>


        <section className="bg-white pt-7">
          <div className="container px-8 mx-auto sm:px-12 lg:px-20">
            <h1 className="text-sm font-bold tracking-wide text-center text-gray-800 uppercase mb-7">Trusted by top-leading companies.</h1>
          </div>
        </section>


        <section className="w-full px-8 py-16 bg-gray-100 xl:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center md:flex-row">

              <div className="w-full space-y-5 md:w-3/5 md:pr-16">
                <p className="font-medium text-indigo-700 uppercase">INFURA</p>
                <h2 className="text-2xl font-extrabold leading-none text-black sm:text-3xl md:text-5xl">
                  This website uses INFURA as RPC interface.
                </h2>
              </div>

              <div className="w-full mt-16 md:mt-0 md:w-2/5">
                <div className="relative z-10 h-auto p-8 py-10 overflow-hidden bg-white border-b-2 border-gray-300 rounded-lg shadow-2xl px-7">
                  <h3 className="mb-6 text-2xl font-medium text-center">Look up a CryptoStar</h3>
                  <input type="number" name="id" className="block w-full px-4 py-3 mb-4 border border-2 border-gray-200 rounded-lg focus:ring focus:ring-indigo-700 focus:outline-none" placeholder="Star ID" />
                  <div className="block">
                    <button type="submit" className="w-full px-3 py-4 font-medium text-white bg-indigo-700 rounded-lg">Look Up a Star 🔎</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
            <p className="mt-8 text-base leading-6 text-center text-gray-400">
              © 2021 CryptoStar, Inc. All rights reserved.
            </p>
          </div>
        </section>


      </main >
      <ToastContainer
        position="bottom-center"
        autoClose={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        pauseOnHover
        theme='dark'
      />

    </div >);
}

export default Home
