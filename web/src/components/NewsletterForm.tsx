export const NewsletterForm = () => {
  return (
    <div className="font-mono bg-blue-100 p-4 mb-8">
      <p className=" text-sm">
        subscribe to my exclusive newsletter with about 30 other lost souls:
      </p>
      <form
        action="https://lesto.larskarbo.no/subscribe"
        className="py-4  "
        method="POST"
        acceptCharset="utf-8"
        style={{}}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                    border border-gray-300 rounded-md appearance-none focus:outline-none
                    focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            />
          </div>
          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              email
            </label>
            <input
              id="email"
              type="email"
              tabIndex={1}
              name="email"
              placeholder="you@domain.com"
              required
              className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                    border border-gray-300 rounded-md appearance-none focus:outline-none
                    focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            />
          </div>
        </div>
        <div style={{ display: "none" }}>
          <label htmlFor="hp">HP</label>
          <input type="text" name="hp" id="hp" />
        </div>

        <input type="hidden" name="list" value="Ao892Z12SyDIIjD86DCVLLuA" />
        <input type="hidden" name="subform" value="yes" />
        <input
          type="submit"
          name="submit"
          id="submit"
          value="I'm awesome"
          className="mt-2 shadow-sm w-full flex justify-center cursor-pointer py-2 px-4 border
                border-transparent text-sm font-medium rounded-md text-gray-900
                 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
        />
      </form>
    </div>
  )
}
