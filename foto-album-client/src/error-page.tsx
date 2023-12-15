
export default function ErrorPage() {

  return (
    <div className="text-gray-900 dark:text-white flex-1 h-full w-full flex flex-col justify-center items-center">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <a className="text-3xl mt-6" href="/">Go home</a>
    </div>
  );
}