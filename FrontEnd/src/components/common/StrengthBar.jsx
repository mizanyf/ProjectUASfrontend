export const StrengthBar = ({ score }) => {
  const colors = ["#EF4444", "#F59E0B", "#F59E0B", "#10B981", "#00695C"];
  const labels = ["Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  return (
    <div className="flex gap-1 items-center mt-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-1 h-1.5 rounded-full transition-all" 
             style={{ background: i <= score ? colors[score] : "#ECEFF1" }} />
      ))}
      <span className="text-[10px] ml-2 font-semibold" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
};