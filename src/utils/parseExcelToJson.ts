import * as XLSX from 'xlsx'
import { ChurchMember } from '@/types/type'

export const parseExcelToJson = (
    arrayBuffer: ArrayBuffer,
): { email: string; name: string }[] => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const jsonData: ChurchMember[] = XLSX.utils.sheet_to_json(worksheet)

    return jsonData.map(data => ({
        email: data.Email,
        name: data.Name,
    }))
}