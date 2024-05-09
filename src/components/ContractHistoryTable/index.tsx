import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ContractHistoryTableProps {
  contractHistories: IContractHistory[]
}

const ContractHistoryTable: React.FC<ContractHistoryTableProps> = ({
  contractHistories,
}) => {
  return (
    <Table>
      <TableCaption>
        {contractHistories.length ? 'List of Signers' : 'No signer yet'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Collaborator</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractHistories.map((history: IContractHistory, id: number) => (
          <TableRow key={id.toString()}>
            <TableCell>{history.project_user.user_name}</TableCell>
            <TableCell>
              Signed at {new Date(history.created_at).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ContractHistoryTable
