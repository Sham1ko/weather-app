import ForecastItem from "./ForecastItem";
import Card from "../ui/Card";

export default function ForecaseCard() {
  return (
    <Card className="h-full">
      <h2 className="font-semibold text-xl">Forecast</h2>
      <div className="flex flex-col">
        {[...Array(5)].map((_, index) => (
          <ForecastItem key={index} />
        ))}
      </div>
    </Card>
  );
}
