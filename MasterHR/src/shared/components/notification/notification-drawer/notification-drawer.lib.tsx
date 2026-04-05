import { Building, Mail } from 'lucide-react'

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'PostOffice':
      return <Building className='h-4 w-4' />
    default:
      return <Mail className='h-4 w-4' />
  }
}

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'PostOffice':
      return 'Почтовые отделения'
    default:
      return type
  }
}
