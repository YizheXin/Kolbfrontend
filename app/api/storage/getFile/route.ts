import { NextRequest } from 'next/server';
import { Storage } from '@google-cloud/storage';
import csvParser from 'csv-parser'; // 安装依赖：npm install csv-parser

// 初始化 Google Cloud Storage
const storage = new Storage();
const csvBucketName = process.env.GCP_CSV_BUCKET || 'ics-analysis-dev-kolbs';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName'); // 必须指定文件名
    const folder = searchParams.get('folder') || ''; // 可选的文件夹
    const page = parseInt(searchParams.get('page') || '1', 10); // 页码（默认第1页）
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10); // 每页显示行数

    // 参数校验
    if (!fileName) {
      return new Response(
        JSON.stringify({ success: false, message: 'fileName parameter is required.' }),
        { status: 400 }
      );
    }

    const bucket = storage.bucket(csvBucketName);
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    const file = bucket.file(filePath);

    // 检查文件是否存在
    const [exists] = await file.exists();
    if (!exists) {
      return new Response(
        JSON.stringify({ success: false, message: 'File not found.' }),
        { status: 404 }
      );
    }

    // 下载 CSV 文件内容
    const rows: any[] = [];
    await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(csvParser()) // 使用 csv-parser 解析文件
        .on('data', (row) => rows.push(row)) // 将每一行数据推入 rows 数组
        .on('end', resolve)
        .on('error', reject);
    });

    // 分页逻辑
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / pageSize);
    if (page > totalPages) {
      return new Response(
        JSON.stringify({ success: false, message: 'Page number exceeds total pages.' }),
        { status: 400 }
      );
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRows);
    const paginatedRows = rows.slice(startIndex, endIndex);

    // 返回数据
    return new Response(
      JSON.stringify({
        success: true,
        data: paginatedRows,
        meta: {
          totalRows,
          totalPages,
          currentPage: page,
          pageSize,
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error reading CSV file:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to read CSV file.', error: err.message }),
      { status: 500 }
    );
  }
}
