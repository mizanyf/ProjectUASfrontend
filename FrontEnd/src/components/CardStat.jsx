function CardStat({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-sm">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
export default CardStat;