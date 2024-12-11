// app/api/firestore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firestore-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const fileName = searchParams.get('docName');

    console.log('GET Request Parameters:', { collection, fileName });

    if (!collection || !fileName) {
      console.log('Missing parameters');
      return NextResponse.json(
        { success: false, message: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    const collectionName = `${collection}_label`;
    console.log(`Attempting to fetch document from collection: ${collectionName}`);

    try {
      const docRef = firestore.collection(collectionName).doc(fileName);
      const doc = await docRef.get();

      // Add more detailed logging
      // console.log('Document reference:', docRef.path);
      // console.log('Document exists:', doc.exists);
      if (doc.exists) {
        const data = doc.data();
        // console.log('Document data:', JSON.stringify(data, null, 2));
        return NextResponse.json({ 
          success: true, 
          data: data,
          debug: {
            path: docRef.path,
            exists: doc.exists
          }
        });
      } else {
        // console.log('Document does not exist');
        return NextResponse.json({ 
          success: false, 
          message: 'Document not found',
          debug: {
            path: docRef.path,
            exists: false
          }
        });
      }
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Firestore error',
          error: firestoreError instanceof Error ? firestoreError.message : 'Unknown error',
          debug: { collection: collectionName, fileName }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { collection, fileName, patterns, isFinished ,isGoodQuality,badQualityType} = body;

    if (!collection || !fileName || !patterns || isFinished === undefined) {
      console.log('Missing required fields:', { collection, fileName, patterns, isFinished});
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const collectionName = `${collection}_label`;
    console.log(`Attempting to write to collection: ${collectionName}`);

    const docRef = firestore.collection(collectionName).doc(fileName);
    
    // Add timestamps
    const documentData = {
      patterns,
      isFinished,
      isGoodQuality,
      badQualityType,
      updatedAt: new Date(),
      createdAt: new Date(),
      // metadata: {
      //   lastModified: new Date(),
      //   environment: process.env.NODE_ENV,
      //   projectId: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT
      // }
    };

    // First check if document exists
    const existingDoc = await docRef.get();
    
    if (existingDoc.exists) {
      console.log('Updating existing document');
      await docRef.set({
        ...documentData,
        createdAt: existingDoc.data()?.createdAt || new Date()
      }, { merge: true });
    } else {
      console.log('Creating new document');
      await docRef.set(documentData);
    }

    console.log('Document write successful');
    
    // Verify the write
    const verificationDoc = await docRef.get();
    console.log('Verification read:', {
      exists: verificationDoc.exists,
      data: verificationDoc.data()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Document updated successfully',
      documentId: fileName,
      verificationData: verificationDoc.data()
    });
  } catch (error) {
    console.error('Detailed POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : 'Unknown error'
      },
      { status: 500 }
    );
  }
}