"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, HelpCircle } from "lucide-react"

export function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    center: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Línea Nacional",
      description: "Atención telefónica",
      value: "+57 (1) 546 1500",
      action: "Llamar ahora",
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      description: "Respuesta en 24 horas",
      value: "info@sena.edu.co",
      action: "Enviar email",
    },
    {
      icon: MessageCircle,
      title: "Chat en Línea",
      description: "Lun - Vie: 8:00 AM - 6:00 PM",
      value: "Disponible ahora",
      action: "Iniciar chat",
    },
    {
      icon: MapPin,
      title: "Oficina Principal",
      description: "Calle 57 No. 8-69",
      value: "Bogotá D.C., Colombia",
      action: "Ver ubicación",
    },
  ]

  const centers = [
    "Centro de Biotecnología Agropecuaria",
    "Centro de Comercio y Servicios",
    "Centro de Diseño y Metrología",
    "Centro de Electricidad, Electrónica y Telecomunicaciones",
    "Centro de Gestión Industrial",
    "Centro de Manufactura en Textiles y Cuero",
    "Centro de Servicios de Salud",
    "Centro de Tecnologías del Transporte",
  ]

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros para resolver tus dudas sobre programas,
            inscripciones o cualquier consulta.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Canales de Atención</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{method.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                            <p className="text-sm font-medium text-gray-900 mb-3">{method.value}</p>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              {method.action}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>Horarios de Atención</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes - Viernes</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados</span>
                  <span className="font-medium">8:00 AM - 12:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos</span>
                  <span className="font-medium">Cerrado</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Envíanos un Mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Centro de Formación</label>
                      <Select value={formData.center} onValueChange={(value) => handleInputChange("center", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un centro" />
                        </SelectTrigger>
                        <SelectContent>
                          {centers.map((center) => (
                            <SelectItem key={center} value={center}>
                              {center}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el motivo de tu consulta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inscripciones">Inscripciones</SelectItem>
                        <SelectItem value="programas">Información de Programas</SelectItem>
                        <SelectItem value="certificados">Certificados</SelectItem>
                        <SelectItem value="bienestar">Bienestar al Aprendiz</SelectItem>
                        <SelectItem value="empleabilidad">Empleabilidad</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Describe tu consulta o mensaje..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "¿Cómo puedo inscribirme a un programa?",
                answer:
                  "Puedes inscribirte a través de nuestra plataforma en línea, visitando cualquier centro de formación o llamando a nuestra línea nacional.",
              },
              {
                question: "¿Los cursos del SENA son gratuitos?",
                answer:
                  "Sí, todos los programas de formación del SENA son completamente gratuitos para los ciudadanos colombianos.",
              },
              {
                question: "¿Qué requisitos necesito para estudiar?",
                answer:
                  "Los requisitos varían según el programa. Generalmente necesitas cédula de ciudadanía, certificado de bachillerato y aprobar las pruebas de selección.",
              },
              {
                question: "¿Ofrecen formación virtual?",
                answer:
                  "Sí, tenemos una amplia oferta de programas virtuales y mixtos que puedes tomar desde cualquier lugar del país.",
              },
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <HelpCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
