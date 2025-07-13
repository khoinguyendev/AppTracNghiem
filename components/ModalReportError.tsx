import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

type ModalReportErrorProps = {
    questionId:number,
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
};

const ModalReportError: React.FC<ModalReportErrorProps> = ({
    modalVisible,
    setModalVisible,
    questionId
}) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');

    const reasons = ['Câu hỏi bị sai', 'Đáp án bị sai', 'Lỗi khác'];

    const handleConfirm = async() => {
        const reason =
            selectedReason === 'Lỗi khác' ? customReason.trim() : selectedReason;

        if (!reason) {
            alert('Vui lòng chọn hoặc nhập lý do.');
            return;
        }

        // TODO: Gửi dữ liệu đi

        const { data, error } = await supabase
            .from('errors')
            .insert([
                { description: reason, question_id: questionId },
            ])
            .select()
        if(!error){
            Toast.show({
                type: 'success',
                text1: 'Báo lỗi',
                text2: `Báo lỗi thành công`,
                position: 'bottom',
            });
            setModalVisible(false);
            setSelectedReason('');
            setCustomReason('');
        }else{
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
                position: 'bottom',
            });
            setModalVisible(false);
            setSelectedReason('');
            setCustomReason('');
        }

       
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/40 px-4">
                <View className="bg-white w-full max-w-md rounded-xl p-6 items-center">
                    <Text className="text-lg font-bold text-center mb-4 text-black">
                        Báo lỗi câu hỏi
                    </Text>

                    <View className="w-full space-y-2 mb-4">
                        {reasons.map((reason) => (
                            <TouchableOpacity
                                key={reason}
                                className={`w-full border px-4 py-2 my-2 rounded-lg ${selectedReason === reason
                                    ? 'border-secondary bg-secondary/10'
                                    : 'border-gray-300'
                                    }`}
                                onPress={() => setSelectedReason(reason)}
                            >
                                <Text className="text-black">{reason}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {selectedReason === 'Lỗi khác' && (
                        <TextInput
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black mb-4"
                            placeholder="Nhập lý do cụ thể"
                            placeholderTextColor="#999"
                            value={customReason}
                            onChangeText={setCustomReason}
                            multiline
                        />
                    )}

                    <View className="flex-row gap-4">
                        <TouchableOpacity
                            className="bg-gray-300 px-4 py-2 rounded-lg"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-black font-medium">Huỷ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-secondary px-4 py-2 rounded-lg"
                            onPress={handleConfirm}
                        >
                            <Text className="text-white font-medium">Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalReportError;
