interface TableProps {
    columns: string[];
    children: React.ReactNode;
    width?: string | number;
}

const Table: React.FC<TableProps> = ({
    columns,
    children,
}) => {

    return (
        <table className="w-[1000px] my-5 min-w-[700px]">
            <thead className="bg-black text-white ">
                <tr>
                    {columns.map((item, index) => (
                        <th className={`p-3 ${index === 0 && 'rounded-ss-lg'}`} key={index}>{item}</th>
                    ))}
                    <th className="p-3 rounded-se-lg">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {children}
            </tbody>
        </table> 
    );
};

export default Table;