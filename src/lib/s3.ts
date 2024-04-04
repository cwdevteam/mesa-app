import { S3, PutObjectCommand } from '@aws-sdk/client-s3'
import { File } from 'formidable'
import fs from 'fs'

const s3client = new S3({
  region: process.env.AWS_IAM_USER_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_IAM_USER_SECRET_KEY || '',
  },
})

export const uploadToS3 = async (file: File) => {
  return new Promise<{
    status: boolean
    filePath?: string
    fileName?: string
    fileType?: string
  }>(async (resolve) => {
    try {
      // Get infomation from uploaded file
      const fileBuffer = fs.readFileSync(file.filepath)
      const fileType = file.mimetype || ''
      const extension = String(file.originalFilename).split('.').pop()
      const fileName = `${file.newFilename}.${extension}`

      const params = {
        Bucket: 'mesa-store',
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileType,
      }

      // Ppload file to s3
      await s3client.send(new PutObjectCommand(params))
      resolve({
        status: true,
        filePath: process.env.AWS_IAM_BASE_URL + '/' + fileName,
        fileName: String(file.originalFilename),
        fileType: extension,
      })
    } catch (err) {
      resolve({ status: false })
    }
  })
}
