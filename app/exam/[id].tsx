import ItemQuestion from '@/components/ItemQuestion';
import { supabase } from '@/lib/supabase';
import { IQuestion, IUserAnswer } from '@/types/Question';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListQuestion = () => {
  const [data, setData] = useState<IQuestion[]>([])
  const [exam,setExam]=useState("");
  const [userAnswers, setUserAnswers] = useState<IUserAnswer[]>([])
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [loading, setLoading] = useState(true)
  const { id } = useLocalSearchParams();
  const handleBack = () => {
    Alert.alert(
      'Xác nhận thoát',
      'Bạn có muốn thoát không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Thoát',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = () => {
    setSubmitModalVisible(true);

  };
  const handleReset = () => {
    const resetAnswers = data.map((item) => ({
      questionId: item.id,
      value: null,
      correct: null,
    }));
  
    setUserAnswers(resetAnswers);
    setIsSubmit(false);
    setNumberCorrect(0);
    setSubmitModalVisible(false);
    setResultModalVisible(false);
  };
  const fetchData = async () => {
    const { data, error } = await supabase.from("exam").select("*,question(*,answer(*))").eq("id", id);


    if (error) {
      console.error('Fetch error:', error)
    } else {
      setData(data[0].question)
      setExam(data[0].title)
      const newAnser = data[0].question.map((item: any) => ({
        questionId: item.id,
        value: null,
        correct: null,
      }))
      setUserAnswers(newAnser);
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [id])
  const handleAnswer = (userAnswer: IUserAnswer, vt: number) => {

    userAnswers[vt] = userAnswer;

  }
  return (
    <>
      <SafeAreaView className="flex-1 bg-primary p-4 ">
        <View className='flex-row gap-3'>
        <TouchableOpacity onPress={handleBack} >
          <Image
            source={require('@/assets/icons/left-arrow.png')}
            resizeMode="contain"
            className="w-8 h-8"
          />
        </TouchableOpacity>
        <Text className='text-white font-bold'>{exam}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#eb9e34" />
        ) : (
          <>
            <View className='justify-center items-center mb-3'>
              {!isSubmit ? <TouchableOpacity className='bg-secondary w-24 rounded-lg p-3 justify-center items-center ' onPress={handleSubmit}>
                <Text className='text-white font-bold text-sm'>Nộp bài</Text>
              </TouchableOpacity> : <TouchableOpacity className='bg-secondary w-24 rounded-lg p-3 justify-center items-center ' onPress={handleReset}>
                <Text className='text-white font-bold text-sm'>Làm lại</Text>
              </TouchableOpacity>}
            </View>
            <FlatList
              // ListHeaderComponent={<Text className='text-white text-2xl font-bold'>Danh sách đề</Text>}
              data={data}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={({ item, index }) => (
                <ItemQuestion item={item} vt={index} handleAnswer={handleAnswer} userAnswer={userAnswers[index]} isSubmit={isSubmit} />)}
            />

          </>

        )}

      </SafeAreaView>
      <>
        <Modal
          animationType="fade"
          transparent
          visible={submitModalVisible}
          onRequestClose={() => setSubmitModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-transparent">
            <View className="bg-white w-80 rounded-xl p-6 items-center">
              <Text className="text-lg font-bold text-center mb-4 text-black">Xác nhận nộp bài?</Text>
              <View className="flex-row space-x-4 gap-2">
                <TouchableOpacity
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onPress={() => setSubmitModalVisible(false)}
                >
                  <Text className="text-black font-medium">Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-secondary px-4 py-2 rounded-lg"
                  onPress={() => {
                    setIsSubmit(true)
                    setSubmitModalVisible(false);
                    setNumberCorrect(userAnswers.filter((i) => i.correct == true).length)
                    setResultModalVisible(true);

                  }}
                >
                  <Text className="text-white font-medium">Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent
          visible={resultModalVisible}
          onRequestClose={() => setResultModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-transparent">
            <View className="bg-white w-80 rounded-xl p-6 items-center">
              <Text className="text-lg font-bold text-center mb-4 text-black">Kết quả:</Text>
              <Text className="text-lg font-bold text-center mb-4 text-black">{numberCorrect}/{data.length}</Text>
              <View className="flex-row space-x-4 gap-2">
                <TouchableOpacity
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onPress={() => setResultModalVisible(false)}
                >
                  <Text className="text-black font-medium">Đóng</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>
      </>
    </>

  );
};

export default ListQuestion;
