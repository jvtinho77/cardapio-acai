import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TableContextType {
    tableId: string | null;
    tableCode: string | null;
    setTableSession: (id: string, code: string) => void;
    isLoading: boolean;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
    const [tableId, setTableId] = useState<string | null>(null);
    const [tableCode, setTableCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Try to recover from localStorage on mount
        const storedId = localStorage.getItem('tableId');
        const storedCode = localStorage.getItem('tableCode');

        if (storedId && storedCode) {
            setTableId(storedId);
            setTableCode(storedCode);
        }
        setIsLoading(false);
    }, []);

    const setTableSession = (id: string, code: string) => {
        setTableId(id);
        setTableCode(code);
        localStorage.setItem('tableId', id);
        localStorage.setItem('tableCode', code);
    };

    return (
        <TableContext.Provider value={{ tableId, tableCode, setTableSession, isLoading }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => {
    const context = useContext(TableContext);
    if (context === undefined) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};
