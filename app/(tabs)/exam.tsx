import ItemExam from '@/components/ItemExam'
import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Exam = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSavedItems = async () => {
    const { data, error } = await supabase
      .from('exam')
      .select('*')

    if (error) {
      console.error('Fetch error:', error)
    } else {
      setData(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSavedItems()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#eb9e34" />
      ) : (
        <FlatList
          ListHeaderComponent={<Text className='text-white text-2xl font-bold'>Danh sách đề</Text>}
          data={data}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <ItemExam
              item={item}
              
            />)}
        />
      )}
    </SafeAreaView>
  )
}

export default Exam
