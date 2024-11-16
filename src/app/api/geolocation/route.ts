import { geolocation } from "@vercel/functions";

export function GET(request: Request) {
  const { city } = geolocation(request);
  // const response = {
  //   city: "Almaty",
  // };
  const response = {
    city,
  };
  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
