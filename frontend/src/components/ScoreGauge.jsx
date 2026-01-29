import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ScoreGauge = ({ score, maxScore = 10, label, color = "#667eea" }) => {
    const percentage = (score / maxScore) * 100;
    const data = [
        { value: score },
        { value: maxScore - score }
    ];

    const COLORS = [color, 'rgba(255, 255, 255, 0.1)'];

    return (
        <div className="score-gauge">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="gauge-center">
                <div className="gauge-score">{score}</div>
                <div className="gauge-max">/ {maxScore}</div>
            </div>
            {label && <div className="gauge-label">{label}</div>}
        </div>
    );
};

export default ScoreGauge;
