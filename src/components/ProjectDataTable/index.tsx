'use client'

import Link from 'next/link'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'

import { DateFormat, DateFormatProps } from '@/components/DateFormat'
import { useState, useEffect } from 'react'
import InviteAcceptButton from '../InviteProjectButton/InviteAcceptButton'

function DateFormatWithLang({ date }: Omit<DateFormatProps, 'lang'>) {
  return <DateFormat date={date} />
}

const isInvitation = (obj: ProjectsByInviteProps | ProjectsByUserProps) =>
  !!(obj as any)?.status

// Define the columns
const columns: ColumnDef<ProjectsByInviteProps | ProjectsByUserProps>[] = [
  {
    id: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <>
        {isInvitation(row.original) &&
        (row.original as ProjectsByInviteProps).status === 'Pending' ? (
          <div>{row.original.project.title}</div>
        ) : (
          <Link
            href={`/project/${row.original.project.id}`}
            className="underline"
          >
            {row.original.project.title}
          </Link>
        )}
      </>
    ),
  },
  {
    id: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <p className="truncate">{row.original.project.description}</p>
    ),
  },
  {
    id: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => {
      return <DateFormatWithLang date={row.original.project.update_at!} />
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <>
        {isInvitation(row.original) &&
        (row.original as ProjectsByInviteProps).status === 'Pending' ? (
          <InviteAcceptButton
            inviteId={(row.original as ProjectsByInviteProps).id}
          />
        ) : (
          <div>Accepted</div>
        )}
      </>
    ),
  },
]

// Define the DataTable component
export const ProjectDataTable = ({
  projectsByInvite,
  projectsByUser,
}: {
  projectsByInvite: ProjectsByInviteProps[]
  projectsByUser: ProjectsByUserProps[]
}) => {
  const [rows, setRows] = useState<
    (ProjectsByInviteProps | ProjectsByUserProps)[]
  >([])

  useEffect(() => {
    return setRows([...projectsByUser, ...projectsByInvite])
  }, [projectsByUser, projectsByInvite])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="rounded-md border col-span-full">
        <Table className="table-fixed w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any, index: number) => (
                  <TableHead
                    key={header.id}
                    className={index === 0 ? 'w-[160px]' : ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </thead>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
