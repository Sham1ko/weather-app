import { ChangeEventHandler, FormEventHandler } from "react";

export default function SearchInput({
  searchState,
  handleSubmit,
  handleChange,
}: SearchInputProps) {
  return (
    <form className="pl-2 w-1/3" onSubmit={handleSubmit}>
      <label className="relative block">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </span>
        <input
          className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Enter City"
          type="text"
          name="search"
          id="search"
          value={searchState}
          onChange={handleChange}
        />
      </label>
    </form>
  );
}

type SearchInputProps = {
  searchState: string;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  handleChange: ChangeEventHandler;
};
