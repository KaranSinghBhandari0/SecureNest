import { NextResponse } from 'next/server';

export const errorResponse = (data = {}) => {
  return NextResponse.json({...data, success: false});
}

export const successResponse = (data = {}) => {
  return NextResponse.json({...data, success: true});
}