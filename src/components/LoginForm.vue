<template>
  <section class="h-screen login-form">
    <div class="container px-6 py-12 h-full form-container">
      <div class="flex justify-center content-center items-center flex-wrap h-full g-6">
        <div class="w-full mb-10">
          <div class="text-center">GitHub Discovery</div>
        </div>
        <div class="w-full">
          <form>
            <!-- Email input -->
            <div class="mb-6">
              <input
                type="text"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
              />
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <input
                type="password"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
              />
            </div>

            <!-- Submit button -->
            <button
              type="button"
              class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full mb-6"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Sign in
            </button>

            <div class="flex justify-between items-center">
              <span>Don't have and account?</span>
              <a href="#!" class="text-slate-600 hover:text-slate-700 focus:text-slate-700 active:text-slate-800 duration-200 transition ease-in-out">Click here to sign up.</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
