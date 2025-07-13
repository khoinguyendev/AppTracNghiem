import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { IAnswer, IQuestion, IUserAnswer } from '@/types/Question'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import ItemAnswer from './ItemAnswer'
import ModalReportError from './ModalReportError'
interface Props {
    item: IQuestion;
    vt: number;
    handleAnswer: (userAnswer: IUserAnswer, vt: number) => void;
    userAnswer: IUserAnswer;
    isSubmit: boolean;
    saved?: boolean;
    handleDelete?: () => void;
}
const ItemQuestion = ({
    item,
    vt,
    handleAnswer,
    userAnswer,
    isSubmit,
    saved = false,
    handleDelete,
}: Props) => {
    const { session } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalReportError, setModalReportError] = useState(false)
    const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
    const [isloadingAdd, setIsLoadingAdd] = useState(false);
    const handleSelectAnswer = (a: IAnswer) => {
        setSelectedAnswerId(a.id)
        const n: IUserAnswer = {
            questionId: item.id,
            correct: a.is_correct,
            value: a.content
        }
        handleAnswer(n, vt);
    }
    useEffect(() => {
        if (!isSubmit) {
            setSelectedAnswerId(null);
        }
    }, [isSubmit]);
    const handleSaved = async () => {
        setIsLoadingAdd(true);



        if (!saved) {
            // ✅ Nếu chưa lưu → kiểm tra và thêm mới
            const { data: existing, error: checkError } = await supabase
                .from('review_questions')
                .select('id')
                .eq('user_id', session?.user.id)
                .eq('question_id', item.id)
                .maybeSingle();

            if (existing) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: `Câu hỏi đã được lưu`,
                    position: 'bottom',
                });
            } else {
                const { error: insertError } = await supabase.from('review_questions').insert({
                    user_id: session?.user.id,
                    question_id: item.id,
                });

                if (insertError) {
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi khi lưu',
                        text2: insertError.message,
                        position: 'bottom',
                    });
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Đã lưu câu hỏi',
                        text2: `Bạn đã lưu câu số ${vt + 1} thành công`,
                        position: 'bottom',
                    });
                }
            }
        } else {
            // ✅ Nếu đã lưu → xoá
            const { data: existing, error: findError } = await supabase
                .from('review_questions')
                .select('id')
                .eq('user_id', session?.user.id)
                .eq('question_id', item.id)
                .maybeSingle();

            if (existing?.id) {
                const { error: deleteError } = await supabase
                    .from('review_questions')
                    .delete()
                    .eq('id', existing.id);

                if (deleteError) {
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi khi xoá',
                        text2: deleteError.message,
                        position: 'bottom',
                    });
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Đã xoá câu hỏi',
                        text2: `Bạn đã xoá câu số ${vt + 1}`,
                        position: 'bottom',
                    });
                    if (handleDelete)
                        handleDelete()
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Không tìm thấy',
                    text2: `Câu hỏi chưa được lưu`,
                    position: 'bottom',
                });
            }
        }

        setIsLoadingAdd(false);
    };

    return (
        <View className="mb-4 rounded-lg border border-white p-3">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg text-secondary">Câu {vt + 1}:</Text>

                <View className='flex-row gap-5'>
                    <TouchableOpacity
                        className="flex-row items-center space-x-1"
                        onPress={()=>setModalReportError(true)}
                    >
                        <MaterialIcons name="error-outline" size={28} color="#eb4d4b" />
                    </TouchableOpacity>
                    {isloadingAdd ? (
                        <ActivityIndicator size="small" color="#eb9e34" />
                    ) : (
                        <TouchableOpacity
                            className="flex-row items-center space-x-1"
                            onPress={handleSaved}
                        >
                            {saved ? (
                                <FontAwesome name="trash" size={24} color="#e74c3c" />
                            ) : (
                                <FontAwesome name="heart" size={24} color="#eb4d4b" />
                            )}
                        </TouchableOpacity>
                    )}
                </View>



            </View>
            <Text className="text-white mb-2">{item.content}</Text>

            {item.image && (
                <>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={{ uri: item.image }}
                            resizeMode="contain"
                            className="w-full h-40 rounded-lg mt-2"
                        />
                    </TouchableOpacity>

                    <Modal
                        visible={modalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 bg-black justify-center items-center">
                            <TouchableOpacity
                                className="absolute top-10 right-6 z-10"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-white text-xl">Đóng</Text>
                            </TouchableOpacity>
                            <Image
                                source={{ uri: item.image }}
                                resizeMode="contain"
                                className="w-full h-full"
                            />
                        </View>
                    </Modal>
                </>
            )}

            <View className="mt-2">
                {item.answer.map((a) => (
                    <ItemAnswer
                        key={a.id}
                        answer={a}
                        userAnswer={userAnswer}
                        isSubmit={isSubmit}
                        isSelected={a.id === selectedAnswerId}
                        onPress={() => handleSelectAnswer(a)}
                    />
                ))}
            </View>
            <ModalReportError questionId={item.id} modalVisible={modalReportError} setModalVisible={setModalReportError}/>
        </View>
    )
}

export default ItemQuestion
