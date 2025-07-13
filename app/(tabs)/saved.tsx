import ItemQuestion from '@/components/ItemQuestion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { IQuestion, IUserAnswer } from '@/types/Question';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Saved = () => {
  const { session } = useAuth();

  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IQuestion[]>([]);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [userAnswers, setUserAnswers] = useState<IUserAnswer[]>([]);
  const [numberCorrect, setNumberCorrect] = useState(0);

  const handleAnswer = (userAnswer: IUserAnswer, vt: number) => {
    const updated = [...userAnswers];
    updated[vt] = userAnswer;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    setIsSubmit(true);
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
    setLoading(true);
    const { data, error } = await supabase
      .from('review_questions')
      .select('*,question(*,answer(*))')
      .eq('user_id', session?.user.id);

    if (error) {
      console.error('Fetch error:', error);
      setData([]);
    } else if (data) {
      const questions = data.map((item: any) => item.question);
      setData(questions);

      const initialAnswers = questions.map((item: any) => ({
        questionId: item.id,
        value: null,
        correct: null,
      }));
      setUserAnswers(initialAnswers);
    } else {
      setData([]);
    }

    setLoading(false);
  };
  const handleDelete=(id:number)=>{
    setData(data.filter((item)=>item.id!=id))
  }
  // ✅ Load lại khi tab được focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [session?.user.id])
  );
  
  return (
    <SafeAreaView className="flex-1 bg-primary p-4" edges={['top']}>
      {loading ? (
        <ActivityIndicator size="large" color="#eb9e34" />
      ) : (
        <>
          <View className="justify-center items-center mb-3">
            {!isSubmit ? (
              <TouchableOpacity
                className="bg-secondary w-24 rounded-lg p-3 justify-center items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white font-bold text-sm">Nộp bài</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-secondary w-24 rounded-lg p-3 justify-center items-center"
                onPress={handleReset}
              >
                <Text className="text-white font-bold text-sm">Làm lại</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={({ item, index }) => (
              <ItemQuestion
                item={item}
                vt={index}
                saved={true}
                handleAnswer={handleAnswer}
                handleDelete={()=>handleDelete(item.id)}
                userAnswer={userAnswers[index]}
                isSubmit={isSubmit}
              />
            )}
          />
        </>
      )}
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
    </SafeAreaView>
  );
};

export default Saved;
