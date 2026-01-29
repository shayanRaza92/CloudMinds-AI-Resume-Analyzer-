import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const SkillsRadar = ({ skills }) => {
    // Transform skills array into radar chart data
    const data = skills.slice(0, 6).map(skill => ({
        skill: skill.length > 15 ? skill.substring(0, 15) + '...' : skill,
        value: 80 + Math.random() * 20 // Random proficiency for demo
    }));

    return (
        <div className="skills-radar">
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: '#fff', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#fff', fontSize: 10 }}
                    />
                    <Radar
                        name="Proficiency"
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.5}
                        animationBegin={0}
                        animationDuration={1500}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillsRadar;
