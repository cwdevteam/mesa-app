import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ContractHistoryTableProps {
  contractHistories: (ProjectContractHistoryProps & {
    projectUser: ProjectUserProps
  })[]
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
        {contractHistories.map((history, id: number) => (
          <TableRow key={id.toString()}>
            <TableCell>{history.projectUser?.user_name}</TableCell>
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
