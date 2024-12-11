import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firestore-client';
import type { DocumentData, QuerySnapshot } from '@google-cloud/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');

    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Missing required collection parameter' },
        { status: 400 }
      );
    }

    const collectionName = `${collection}_label`;

    console.log(`Fetching analytics for collection: ${collectionName}`);

    const snapshot: QuerySnapshot<DocumentData> = await firestore.collection(collectionName).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: 'No documents found in the collection' },
        { status: 404 }
      );
    }

    // Initialize counters
    let inProgress = 0;
    let finished = 0;
    let goodQuality = 0;
    let badQuality = 0;
    const badQualityTypes: Record<string, number> = {};
    const patterns: Record<string, { truePositive: number; trueNegative: number }> = {};

    // Process each document
    snapshot.forEach((doc) => {
      const data = doc.data();

      // Count finished and in-progress documents
      if (data.isFinished) {
        finished++;
      } else {
        inProgress++;
      }

      // Count good and bad quality
      if (data.isGoodQuality === true) {
        goodQuality++;
      } else if (data.isGoodQuality === false) {
        badQuality++;
        if (data.badQualityType) {
          badQualityTypes[data.badQualityType] = (badQualityTypes[data.badQualityType] || 0) + 1;
        }
      }

      // Analyze patterns
      if (data.patterns) {
        Object.entries(data.patterns).forEach(([pattern, value]) => {
          if (!patterns[pattern]) {
            patterns[pattern] = { truePositive: 0, trueNegative: 0 };
          }

          if (value === true) {
            patterns[pattern].truePositive++;
          } else if (value === false) {
            patterns[pattern].trueNegative++;
          }
        });
      }
    });

    // Convert patterns into array for chart visualization
    const patternStats = Object.entries(patterns).map(([name, stats]) => ({
      name,
      ...stats,
    }));

    const analyticsData = {
      inProgress,
      finished,
      goodQuality,
      badQuality,
      badQualityTypes,
      patterns: patternStats,
    };

    console.log(`Analytics data generated: ${JSON.stringify(analyticsData, null, 2)}`);

    return NextResponse.json({ success: true, data: analyticsData });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
