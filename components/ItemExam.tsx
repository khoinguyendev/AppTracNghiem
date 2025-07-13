import { Exam } from '@/types/Exam'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const ItemExam = ({ item }: { item: Exam}) => {
  return (
    <Link href={`/exam/${item.id}`} className='bg-primary p-4 rounded-lg mb-4 border border-red-500 flex-row justify-between items-center'>
      <View className='flex-row items-center gap-2'>
        <Ionicons name='book' size={24} color='white' />
        <Text className='text-white text-lg font-bold'>{item.title}</Text>
      </View>
    </Link>
  )
}

export default ItemExam