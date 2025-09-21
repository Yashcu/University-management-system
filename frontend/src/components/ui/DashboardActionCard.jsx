import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { ArrowRight } from 'lucide-react'

export const DashboardActionCard = ({
  title,
  description,
  icon: Icon,
  link,
  onNavigate,
  color = 'blue'
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(link)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-between">
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default DashboardActionCard
