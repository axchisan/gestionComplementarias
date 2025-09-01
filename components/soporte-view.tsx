"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, Mail, Phone, MessageCircle, FileText, AlertCircle, CheckCircle } from "lucide-react"

export function SoporteView() {
  const faqItems = [
    {
      question: "¿Cómo puedo recuperar mi contraseña?",
      answer:
        "Haz clic en '¿Olvidaste tu contraseña?' en la página de login y sigue las instrucciones enviadas a tu correo institucional.",
    },
    {
      question: "¿Qué hago si mi correo no es reconocido?",
      answer:
        "Verifica que estés usando tu correo institucional del SENA (@sena.edu.co). Si el problema persiste, contacta al administrador.",
    },
    {
      question: "¿Cuánto tiempo tarda la aprobación de mi solicitud?",
      answer: "Las solicitudes de acceso son revisadas en un plazo de 24-48 horas hábiles.",
    },
    {
      question: "¿Puedo usar el sistema desde mi celular?",
      answer: "Sí, el sistema es compatible con dispositivos móviles y puede instalarse como PWA.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Correo Electrónico</h3>
            <p className="text-sm text-gray-600 mb-4">Respuesta en 24 horas</p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">soporte@sena.edu.co</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
            <p className="text-sm text-gray-600 mb-4">Lun - Vie: 8:00 AM - 5:00 PM</p>
            <Button variant="outline" className="border-blue-600 text-blue-600">
              +57 (1) 546 1500
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chat en Línea</h3>
            <p className="text-sm text-gray-600 mb-4">Disponible ahora</p>
            <Button variant="outline" className="border-purple-600 text-purple-600">
              Iniciar Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-green-600" />
            <span>Preguntas Frecuentes</span>
          </CardTitle>
          <CardDescription>Encuentra respuestas rápidas a las consultas más comunes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Ticket Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Crear Ticket de Soporte</span>
          </CardTitle>
          <CardDescription>Si no encuentras la respuesta que buscas, envíanos tu consulta</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <Input placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico *</label>
                <Input type="email" placeholder="tu.correo@sena.edu.co" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Problema *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="login">Problemas de acceso/login</SelectItem>
                  <SelectItem value="password">Recuperación de contraseña</SelectItem>
                  <SelectItem value="solicitud">Problemas con solicitudes</SelectItem>
                  <SelectItem value="reportes">Generación de reportes</SelectItem>
                  <SelectItem value="navegacion">Navegación del sistema</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Problema *</label>
              <Textarea placeholder="Describe detalladamente el problema que estás experimentando..." rows={5} />
            </div>

            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-gray-600">
                Incluye toda la información posible para ayudarnos a resolver tu problema más rápido.
              </p>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Enviar Ticket de Soporte</Button>
          </form>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Estado del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Sistema Principal</span>
              </div>
              <span className="text-sm text-green-600">Operativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Base de Datos</span>
              </div>
              <span className="text-sm text-green-600">Operativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Generación de Reportes</span>
              </div>
              <span className="text-sm text-green-600">Operativo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
