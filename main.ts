import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import sharp from 'sharp'
import { z } from 'zod'

const server = new McpServer({
  name: 'mcp-spykerel04d-test',
  version: '1.0.0',
  description: 'Playground mcp test',
})

server.tool(
  'get_image_size',
  'Obtener dimensiones de una imagen en disco',
  {
    imagePath: z.string().describe('Ruta relativa o absoluta a la imagen'),
  },
  async ({ imagePath }) => {
    try {
      const image = sharp(imagePath)
      const metadata = await image.metadata()
      const { width, height, format } = metadata

      return {
        content: [
          {
            type: 'text',
            text: `Dimensiones: ${width}x${height} Formato: ${format}`,
          },
        ],
      }
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al obtener tamaño: ${(err as Error).message}`,
          },
        ],
      }
    }
  },
)

server.tool(
  'resize_image',
  'Redimensionar imagen y guardar como una nueva',
  {
    imagePath: z.string().describe('Ruta a la imagen original'),
    width: z.number().int().positive().describe('Ancho deseado'),
    height: z.number().int().positive().describe('Alto deseado'),
    outputPath: z.string().describe('Ruta donde guardar la nueva imagen'),
  },
  async ({ imagePath, width, height, outputPath }) => {
    try {
      await sharp(imagePath).resize(width, height).toFile(outputPath)
      return {
        content: [
          {
            type: 'text',
            text: `Imagen guardada en ${outputPath} con tamaño ${width}x${height}`,
          },
        ],
      }
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al redimensionar imagen: ${(err as Error).message}`,
          },
        ],
      }
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
